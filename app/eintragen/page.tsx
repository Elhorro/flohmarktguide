'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CircleCheck as CheckCircle,
  Loader as Loader2,
  CircleAlert as AlertCircle,
  MapPin,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { FlohmarktTyp } from '@/lib/types';

// Dynamically imported to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-[260px] rounded-xl bg-stone-100 animate-pulse flex items-center justify-center">
      <span className="text-stone-400 text-sm">Karte wird geladen…</span>
    </div>
  ),
});

const schema = z
  .object({
    titel: z.string().min(3, 'Titel muss mindestens 3 Zeichen haben'),
    typ: z.enum(['Flohmarkt', 'Fetzenmarkt', 'Hausflohmarkt', 'Antikmarkt'] as const),
    datum: z.date({ required_error: 'Bitte ein Datum wählen' }),
    datum_ende: z.date().optional().nullable(),
    uhrzeit_start: z.string().min(1, 'Startzeit ist erforderlich'),
    uhrzeit_ende: z.string().min(1, 'Endzeit ist erforderlich'),
    adresse: z.string().min(3, 'Adresse muss mindestens 3 Zeichen haben'),
    plz: z.string().max(10).optional(),
    stadt: z.string().min(2, 'Stadt muss mindestens 2 Zeichen haben'),
    beschreibung: z.string().min(10, 'Beschreibung muss mindestens 10 Zeichen haben').max(1000),
    kontakt: z.string().optional(),
  })
  .refine((d) => !d.datum_ende || d.datum_ende >= d.datum, {
    path: ['datum_ende'],
    message: 'Enddatum muss gleich oder nach dem Startdatum liegen',
  });

type FormData = z.infer<typeof schema>;
interface LatLng { lat: number; lng: number }

const typenOptionen: FlohmarktTyp[] = ['Flohmarkt', 'Fetzenmarkt', 'Hausflohmarkt', 'Antikmarkt'];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-stone-700 mb-1.5">
      {children}
      {required && <span className="text-orange-500 ml-1">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
      <AlertCircle size={12} />
      {message}
    </p>
  );
}

const inputClass =
  'w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all bg-white';
const errorInputClass =
  'w-full px-4 py-2.5 border border-red-300 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all bg-white';

export default function EintragenPage() {
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [manualCoords, setManualCoords] = useState<LatLng | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mehrtägig, setMehrtägig] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      typ: 'Flohmarkt',
      uhrzeit_start: '08:00',
      uhrzeit_ende: '14:00',
    },
  });

  const watchedAdresse = watch('adresse');
  const watchedPlz = watch('plz');
  const watchedStadt = watch('stadt');

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const body: Record<string, unknown> = {
        ...data,
        datum: data.datum.toISOString().split('T')[0],
        datum_ende: mehrtägig && data.datum_ende
          ? data.datum_ende.toISOString().split('T')[0]
          : null,
        plz: data.plz || undefined,
      };
      if (manualCoords) {
        body.lat = manualCoords.lat;
        body.lng = manualCoords.lng;
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      reset();
      setManualCoords(null);
      setShowMap(false);
    } catch {
      setSubmitError('Ein Fehler ist aufgetreten. Bitte versuche es nochmal.');
    }
  };

  return (
    <>
      <Navigation />
      <div className="bg-orange-50/40 min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-800 mb-2">Flohmarkt eintragen</h1>
            <p className="text-stone-500">
              Trag deinen Markt kostenlos ein. Nach kurzer Prüfung wird er freigeschaltet.
            </p>
          </div>

          {success ? (
            <div className="bg-white rounded-3xl border border-green-100 p-10 text-center shadow-sm">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-3">Danke!</h2>
              <p className="text-stone-500 mb-8 text-base leading-relaxed">
                Dein Flohmarkt wurde eingereicht und wird nach Prüfung freigeschaltet. Das dauert
                in der Regel nicht lange!
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Weiteren Markt eintragen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="bg-white rounded-3xl border border-stone-100 p-6 sm:p-8 shadow-sm space-y-5">
                {/* Titel */}
                <div>
                  <FieldLabel required>Titel des Marktes</FieldLabel>
                  <input
                    {...register('titel')}
                    placeholder="z.B. Großer Frühlingsflohmarkt Graz"
                    className={errors.titel ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.titel?.message} />
                </div>

                {/* Typ */}
                <div>
                  <FieldLabel required>Art des Marktes</FieldLabel>
                  <select
                    {...register('typ')}
                    className={errors.typ ? errorInputClass : inputClass}
                  >
                    {typenOptionen.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.typ?.message} />
                </div>

                {/* Datum */}
                <div>
                  <FieldLabel required>
                    {mehrtägig ? 'Startdatum' : 'Datum'}
                  </FieldLabel>
                  <Controller
                    name="datum"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className={errors.datum ? errorInputClass : inputClass}
                        onChange={(e) =>
                          field.onChange(e.target.value ? new Date(e.target.value) : null)
                        }
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split('T')[0]
                            : ''
                        }
                      />
                    )}
                  />
                  <FieldError message={errors.datum?.message} />

                  <label className="flex items-center gap-2 mt-3 text-sm text-stone-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={mehrtägig}
                      onChange={(e) => setMehrtägig(e.target.checked)}
                      className="rounded border-stone-300 text-orange-500 focus:ring-orange-300"
                    />
                    Mehrtägiger Markt (z.B. Freitag bis Sonntag)
                  </label>
                </div>

                {/* Enddatum (nur bei mehrtägig) */}
                {mehrtägig && (
                  <div>
                    <FieldLabel required>Enddatum</FieldLabel>
                    <Controller
                      name="datum_ende"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className={errors.datum_ende ? errorInputClass : inputClass}
                          onChange={(e) =>
                            field.onChange(e.target.value ? new Date(e.target.value) : null)
                          }
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split('T')[0]
                              : ''
                          }
                        />
                      )}
                    />
                    <FieldError message={errors.datum_ende?.message} />
                    <p className="text-xs text-stone-400 mt-1.5">
                      Die Uhrzeiten unten gelten dann für jeden Tag.
                    </p>
                  </div>
                )}

                {/* Zeiten */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Beginn</FieldLabel>
                    <input
                      type="time"
                      {...register('uhrzeit_start')}
                      className={errors.uhrzeit_start ? errorInputClass : inputClass}
                    />
                    <FieldError message={errors.uhrzeit_start?.message} />
                  </div>
                  <div>
                    <FieldLabel required>Ende</FieldLabel>
                    <input
                      type="time"
                      {...register('uhrzeit_ende')}
                      className={errors.uhrzeit_ende ? errorInputClass : inputClass}
                    />
                    <FieldError message={errors.uhrzeit_ende?.message} />
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <FieldLabel required>Straße &amp; Hausnummer</FieldLabel>
                  <input
                    {...register('adresse')}
                    placeholder="z.B. Hauptplatz 1"
                    className={errors.adresse ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.adresse?.message} />
                </div>

                {/* PLZ + Stadt */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <FieldLabel>PLZ</FieldLabel>
                    <input
                      {...register('plz')}
                      placeholder="z.B. 8010"
                      maxLength={10}
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2">
                    <FieldLabel required>Stadt / Gemeinde</FieldLabel>
                    <input
                      {...register('stadt')}
                      placeholder="z.B. Graz"
                      className={errors.stadt ? errorInputClass : inputClass}
                    />
                    <FieldError message={errors.stadt?.message} />
                  </div>
                </div>

                {/* Location Picker (optional) */}
                <div className="border border-stone-100 rounded-2xl p-4 bg-stone-50/50">
                  <button
                    type="button"
                    onClick={() => setShowMap((v) => !v)}
                    className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors w-full"
                  >
                    <MapPin size={16} className={manualCoords ? 'text-orange-500' : 'text-stone-400'} />
                    <span>
                      {manualCoords
                        ? '✓ Standort manuell gesetzt – Karte anzeigen / ändern'
                        : 'Standort auf Karte verfeinern (optional)'}
                    </span>
                    <span className="ml-auto text-stone-300">{showMap ? '▲' : '▼'}</span>
                  </button>

                  {showMap && (
                    <div className="mt-4">
                      <p className="text-xs text-stone-400 mb-3">
                        Adresse oben eingeben und auf{' '}
                        <em>Adresse auf Karte finden</em> klicken, oder direkt auf die Karte
                        klicken um den Standort zu setzen.
                      </p>
                      <LocationPicker
                        adresse={watchedAdresse}
                        plz={watchedPlz}
                        stadt={watchedStadt}
                        onChange={setManualCoords}
                      />
                    </div>
                  )}
                </div>

                {/* Beschreibung */}
                <div>
                  <FieldLabel required>Beschreibung</FieldLabel>
                  <textarea
                    {...register('beschreibung')}
                    rows={5}
                    placeholder="Was erwartet die Besucher? Welche Waren werden angeboten? Besonderheiten..."
                    className={`resize-none ${errors.beschreibung ? errorInputClass : inputClass}`}
                  />
                  <FieldError message={errors.beschreibung?.message} />
                </div>

                {/* Kontakt */}
                <div>
                  <FieldLabel>Kontakt (optional)</FieldLabel>
                  <input
                    {...register('kontakt')}
                    placeholder="Telefon, E-Mail oder Website"
                    className={inputClass}
                  />
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle size={16} />
                    {submitError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Wird eingereicht...
                      </>
                    ) : (
                      'Markt einreichen'
                    )}
                  </button>
                  <p className="text-center text-xs text-stone-400 mt-3">
                    Felder mit <span className="text-orange-500">*</span> sind Pflichtfelder. Alle
                    Angaben werden vor Veröffentlichung geprüft.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
