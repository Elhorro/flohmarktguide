'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircleCheck as CheckCircle, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { createFlohmarkt } from '@/lib/data';
import { FlohmarktTyp } from '@/lib/types';

const schema = z.object({
  titel: z.string().min(3, 'Titel muss mindestens 3 Zeichen haben'),
  typ: z.enum(['Flohmarkt', 'Fetzenmarkt', 'Hausflohmarkt', 'Antikmarkt'] as const),
  datum: z.date({ required_error: 'Bitte ein Datum wählen' }),
  uhrzeit_start: z.string().min(1, 'Startzeit ist erforderlich'),
  uhrzeit_ende: z.string().min(1, 'Endzeit ist erforderlich'),
  adresse: z.string().min(3, 'Adresse muss mindestens 3 Zeichen haben'),
  stadt: z.string().min(2, 'Stadt muss mindestens 2 Zeichen haben'),
  beschreibung: z.string().min(10, 'Beschreibung muss mindestens 10 Zeichen haben').max(1000),
  kontakt: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

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

  const {
    register,
    control,
    handleSubmit,
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

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      await createFlohmarkt(data);
      setSuccess(true);
      reset();
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
            <h1 className="text-3xl font-bold text-stone-800 mb-2">
              Flohmarkt eintragen
            </h1>
            <p className="text-stone-500">
              Trag deinen Markt kostenlos ein. Nach kurzer Prüfung wird er freigeschaltet.
            </p>
          </div>

          {success ? (
            <div className="bg-white rounded-3xl border border-green-100 p-10 text-center shadow-sm">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-3">
                Danke!
              </h2>
              <p className="text-stone-500 mb-8 text-base leading-relaxed">
                Dein Flohmarkt wurde eingereicht und wird nach Prüfung freigeschaltet.
                Das dauert in der Regel nicht lange!
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
                <div>
                  <FieldLabel required>Titel des Marktes</FieldLabel>
                  <input
                    {...register('titel')}
                    placeholder="z.B. Großer Frühlingsflohmarkt Graz"
                    className={errors.titel ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.titel?.message} />
                </div>

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

                <div>
                  <FieldLabel required>Datum</FieldLabel>
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
                </div>

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

                <div>
                  <FieldLabel required>Straße &amp; Hausnummer</FieldLabel>
                  <input
                    {...register('adresse')}
                    placeholder="z.B. Hauptplatz 1"
                    className={errors.adresse ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.adresse?.message} />
                </div>

                <div>
                  <FieldLabel required>Stadt / Gemeinde</FieldLabel>
                  <input
                    {...register('stadt')}
                    placeholder="z.B. Graz"
                    className={errors.stadt ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.stadt?.message} />
                </div>

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
                    Felder mit <span className="text-orange-500">*</span> sind Pflichtfelder.
                    Alle Angaben werden vor Veröffentlichung geprüft.
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
