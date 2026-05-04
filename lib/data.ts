import { getSupabase } from './supabase';
import { Flohmarkt, FilterOption } from './types';

function getDateRange(filter: FilterOption): { from: string; to: string } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (filter === 'heute') {
    const str = today.toISOString().split('T')[0];
    return { from: str, to: str };
  }

  if (filter === 'wochenende') {
    const diffToSat = (6 - today.getDay() + 7) % 7;
    const sat = new Date(today);
    sat.setDate(today.getDate() + diffToSat);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    return { from: sat.toISOString().split('T')[0], to: sun.toISOString().split('T')[0] };
  }

  if (filter === 'naechste_woche') {
    const diffToMon = ((1 - today.getDay() + 7) % 7) + 7;
    const mon = new Date(today);
    mon.setDate(today.getDate() + diffToMon);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { from: mon.toISOString().split('T')[0], to: sun.toISOString().split('T')[0] };
  }

  return null;
}

function buildFilteredQuery(filter: FilterOption) {
  const today = new Date().toISOString().split('T')[0];
  let query = getSupabase()
    .from('fm_flea_markets')
    .select('*')
    .eq('freigegeben', true)
    .order('datum', { ascending: true });

  const range = getDateRange(filter);
  if (range) {
    query = query.gte('datum', range.from).lte('datum', range.to);
  } else {
    query = query.gte('datum', today);
  }
  return query;
}

export async function getFlohmärkte(filter: FilterOption = 'alle'): Promise<Flohmarkt[]> {
  const { data, error } = await buildFilteredQuery(filter);
  if (error) throw error;
  return data ?? [];
}

export async function getNext10Flohmärkte(filter: FilterOption = 'alle'): Promise<Flohmarkt[]> {
  const { data, error } = await buildFilteredQuery(filter).limit(10);
  if (error) throw error;
  return data ?? [];
}

export async function getFlohmarktById(id: string): Promise<Flohmarkt | null> {
  const { data, error } = await getSupabase()
    .from('fm_flea_markets')
    .select('*')
    .eq('id', id)
    .eq('freigegeben', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAlleFlohmärkte(): Promise<Flohmarkt[]> {
  const { data, error } = await getSupabase()
    .from('fm_flea_markets')
    .select('*')
    .eq('freigegeben', true)
    .order('datum', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedMärkte(limit = 6): Promise<Flohmarkt[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await getSupabase()
    .from('fm_flea_markets')
    .select('*')
    .eq('freigegeben', true)
    .eq('featured', true)
    .gte('datum', today)
    .order('datum', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
