import { archetypes } from './archetypes';

export function getInviteCode() {
  if (typeof window === 'undefined') return 'FILM';
  const q = new URLSearchParams(location.search);
  const ref = q.get('ref');
  if (ref) localStorage.setItem('film_ref', ref);
  let code = localStorage.getItem('film_invite');
  if (!code) {
    code = Math.random().toString(36).slice(2, 8).toUpperCase();
    localStorage.setItem('film_invite', code);
  }
  return code;
}

export function scoreAnswers(answers: number[]) {
  const counts = [0,0,0,0];
  const weighted = [0,0,0,0];
  answers.forEach((v, i) => { counts[v]++; weighted[v] += (i % 7) + 1; });
  const score = answers.reduce((s, v, i) => s + (v + 1) * ((i % 9) + 3), 0);
  const dominant = weighted.indexOf(Math.max(...weighted));
  const secondary = counts.indexOf(Math.max(...counts.map((c,idx)=>idx===dominant?-1:c)));
  const idx = (dominant * 6 + secondary * 3 + score) % archetypes.length;
  const match = 82 + (score % 17);
  return { archetype: archetypes[idx], match, counts, score };
}
