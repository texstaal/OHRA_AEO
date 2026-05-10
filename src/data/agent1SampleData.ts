import type { RawEntry } from '@/types/agent1'

export const sampleData: RawEntry[] = [
  // Young drivers (8)
  { source: 'Reddit', date: '2025-03-10', text: 'Welke autoverzekering is het goedkoopst voor jongeren van 18 jaar?', competitor: 'Allianz Direct', url: 'reddit.com/r/financieel' },
  { source: 'AI search query', date: '2025-03-11', text: 'Autoverzekering voor 18-jarige, wat zijn mijn opties in Nederland?', competitor: '', url: '' },
  { source: 'Tweakers', date: '2025-03-12', text: 'Ben net 20 jaar oud, mijn premie is belachelijk hoog bij mijn verzekeraar', competitor: 'Centraal Beheer', url: 'tweakers.net/forum' },
  { source: 'Google Autocomplete', date: '2025-03-15', text: 'autoverzekering jonge bestuurder tips 2025', competitor: '', url: '' },
  { source: 'YouTube comments', date: '2025-03-18', text: 'Als jongere rijder betaalde ik veel te veel totdat ik ging vergelijken via Independer', competitor: 'Independer', url: 'youtube.com' },
  { source: 'AI search query', date: '2025-03-20', text: 'Is er een autoverzekering speciaal voor jonge rijders zonder grote toeslag?', competitor: '', url: '' },
  { source: 'Review platform', date: '2025-03-22', text: 'Jongste rijder in ons gezin is 19 jaar, welke verzekeraar geeft de beste jongerenkorting?', competitor: 'ANWB', url: 'trustpilot.com' },
  { source: 'Reddit', date: '2025-03-25', text: 'Net mijn eerste auto gekocht als beginnend bestuurder, waar moet ik beginnen qua verzekering?', competitor: '', url: 'reddit.com/r/auto' },

  // Electric vehicle (8)
  { source: 'Tweakers', date: '2025-01-10', text: 'Dekt mijn autoverzekering schade aan de batterij van mijn elektrische auto?', competitor: '', url: 'tweakers.net/forum/ev' },
  { source: 'AI search query', date: '2025-01-12', text: 'Autoverzekering elektrische auto Nederland 2025, wat zijn de verschillen?', competitor: '', url: '' },
  { source: 'Reddit', date: '2025-01-15', text: 'Welke verzekeraar dekt laadpaal schade voor Tesla Model 3?', competitor: 'Centraal Beheer', url: 'reddit.com/r/electricvehicles' },
  { source: 'YouTube comments', date: '2025-01-18', text: 'Allianz Direct heeft een speciale EV verzekering aangeboden via hun site, interessant', competitor: 'Allianz Direct', url: 'youtube.com' },
  { source: 'AI search query', date: '2025-01-20', text: 'Is mijn Tesla verzekerd tegen diefstal van de laadkabel?', competitor: '', url: '' },
  { source: 'Google Autocomplete', date: '2025-01-22', text: 'EV autoverzekering batterij dekking Nederland vergelijken', competitor: '', url: '' },
  { source: 'Review platform', date: '2025-01-25', text: 'Verzekering voor mijn elektrische auto via Independer geregeld, goede vergelijking', competitor: 'Independer', url: 'trustpilot.com' },
  { source: 'Tweakers', date: '2025-01-28', text: 'Ioniq 6 geleasd, welke autoverzekering is het best voor hybride en EV modellen?', competitor: 'FBTO', url: 'tweakers.net' },

  // WA vs All-risk (7)
  { source: 'AI search query', date: '2025-03-05', text: 'Is allrisk nog slim voor een auto van 8 jaar oud?', competitor: '', url: '' },
  { source: 'Google Autocomplete', date: '2025-03-07', text: 'verschil WA WA+ allrisk autoverzekering uitgelegd', competitor: '', url: '' },
  { source: 'Reddit', date: '2025-03-09', text: 'Wanneer switch je van allrisk naar WA verzekering? Bij 5 jaar oud of 7 jaar?', competitor: 'FBTO', url: 'reddit.com/r/financieel' },
  { source: 'Tweakers', date: '2025-03-12', text: 'WA+ of allrisk voor een Volkswagen Golf uit 2019, wat raadt iemand aan?', competitor: 'Centraal Beheer', url: 'tweakers.net' },
  { source: 'AI search query', date: '2025-03-14', text: 'Wat dekt WA+ verzekering precies niet vergeleken met all-risk?', competitor: '', url: '' },
  { source: 'YouTube comments', date: '2025-03-16', text: 'Univé heeft een handige keuzehulp om te bepalen welk dekkingsniveau je nodig hebt', competitor: 'Univé', url: 'youtube.com' },
  { source: 'Review platform', date: '2025-03-19', text: 'Overstap van allrisk naar WA bespaart me 40 euro per maand, had dit eerder moeten doen', competitor: 'InShared', url: 'trustpilot.com' },

  // Claim handling (6)
  { source: 'Review platform', date: '2025-04-01', text: 'Hoe snel handelt OHRA schadeclaims af vergeleken met andere verzekeraars?', competitor: 'OHRA', url: 'trustpilot.com/ohra' },
  { source: 'Reddit', date: '2025-04-03', text: 'Centraal Beheer heeft mijn schademelding heel snel verwerkt, minder dan een week!', competitor: 'Centraal Beheer', url: 'reddit.com/r/autoverzekering' },
  { source: 'AI search query', date: '2025-04-05', text: 'Hoe lang duurt schadeafhandeling bij autoverzekering gemiddeld in Nederland?', competitor: '', url: '' },
  { source: 'Tweakers', date: '2025-04-08', text: 'ANWB vraagt enorm veel papierwerk bij een schademelding, erg frustrerend', competitor: 'ANWB', url: 'tweakers.net' },
  { source: 'YouTube comments', date: '2025-04-10', text: 'Na mijn aanrijding werd ik snel en vriendelijk geholpen door Allianz Direct', competitor: 'Allianz Direct', url: 'youtube.com' },
  { source: 'Review platform', date: '2025-04-12', text: 'Hoe meld ik schade als ik zelf schuldig was? Stap voor stap uitleg graag', competitor: '', url: 'trustpilot.com' },

  // Switching insurance (6)
  { source: 'AI search query', date: '2025-02-28', text: 'Kan ik makkelijk overstappen van Centraal Beheer naar OHRA?', competitor: 'Centraal Beheer', url: '' },
  { source: 'Reddit', date: '2025-03-01', text: 'Hoe werkt overstappen naar een andere autoverzekeraar precies in Nederland?', competitor: '', url: 'reddit.com/r/financieel' },
  { source: 'Google Autocomplete', date: '2025-03-02', text: 'autoverzekering overstappen wanneer mag dat tussentijds', competitor: '', url: '' },
  { source: 'Tweakers', date: '2025-03-03', text: 'Ben klaar met ANWB, wil wisselen van verzekeraar maar weet niet hoe ik moet beginnen', competitor: 'ANWB', url: 'tweakers.net' },
  { source: 'Review platform', date: '2025-03-04', text: 'Overstap van Univé naar InShared was heel makkelijk via hun overstapservice', competitor: 'Univé', url: 'trustpilot.com' },
  { source: 'AI search query', date: '2025-03-06', text: 'Verlies ik mijn no-claim korting als ik overstap naar een andere verzekeraar?', competitor: '', url: '' },

  // No-claim discount (5)
  { source: 'AI search query', date: '2025-01-30', text: 'Hoeveel no-claim korting bouw ik op per schadevrij jaar?', competitor: '', url: '' },
  { source: 'Reddit', date: '2025-02-01', text: 'Val ik terug in no-claim als ik een kleine schade meld bij mijn verzekeraar?', competitor: 'Centraal Beheer', url: 'reddit.com' },
  { source: 'Google Autocomplete', date: '2025-02-03', text: 'no-claim beschermer autoverzekering waard de extra kosten', competitor: '', url: '' },
  { source: 'Tweakers', date: '2025-02-05', text: 'FBTO heeft een goede no-claim beschermer optie, kan iemand dit bevestigen?', competitor: 'FBTO', url: 'tweakers.net' },
  { source: 'AI search query', date: '2025-02-07', text: 'Hoe werkt bonus-malus systeem bij no-claim in Nederland?', competitor: '', url: '' },

  // Roadside assistance (5)
  { source: 'AI search query', date: '2025-03-25', text: 'Welke autoverzekering heeft de beste pechhulp in Nederland en buitenland?', competitor: '', url: '' },
  { source: 'Reddit', date: '2025-03-27', text: 'Is ANWB wegenwacht beter dan de pechhulp die bij mijn autoverzekering zit?', competitor: 'ANWB', url: 'reddit.com' },
  { source: 'Review platform', date: '2025-03-29', text: 'De wegenwacht van Centraal Beheer was er binnen 30 minuten na pech onderweg, top!', competitor: 'Centraal Beheer', url: 'trustpilot.com' },
  { source: 'YouTube comments', date: '2025-03-31', text: 'Pechhulp buitenland is superbelangrijk, controleer dit altijd bij uw autoverzekering', competitor: '', url: 'youtube.com' },
  { source: 'Google Autocomplete', date: '2025-04-02', text: 'pechhulp buitenland autoverzekering gedekt welke landen', competitor: '', url: '' },

  // Customer service (4)
  { source: 'Review platform', date: '2025-04-15', text: 'OHRA klantenservice is erg moeilijk bereikbaar, lange wachttijd aan de telefoon', competitor: 'OHRA', url: 'trustpilot.com/ohra' },
  { source: 'Reddit', date: '2025-04-17', text: 'Univé heeft uitstekende klantenservice, altijd snel en vriendelijk geholpen', competitor: 'Univé', url: 'reddit.com' },
  { source: 'Tweakers', date: '2025-04-19', text: 'Hoe bereikbaar is FBTO telefonisch bij een urgente claim of vraag?', competitor: 'FBTO', url: 'tweakers.net' },
  { source: 'Review platform', date: '2025-04-20', text: 'Review: klantenservice OHRA heeft zich sterk verbeterd in 2025 vergeleken met vorig jaar', competitor: 'OHRA', url: 'trustpilot.com' },

  // Cancellation (4)
  { source: 'AI search query', date: '2025-04-20', text: 'Hoe zeg ik mijn autoverzekering op bij Centraal Beheer stap voor stap?', competitor: 'Centraal Beheer', url: '' },
  { source: 'Google Autocomplete', date: '2025-04-21', text: 'autoverzekering opzeggen brief voorbeeld download', competitor: '', url: '' },
  { source: 'Reddit', date: '2025-04-22', text: 'Kan ik mijn autoverzekering maandelijks opzeggen of moet ik het hele jaar afwachten?', competitor: 'InShared', url: 'reddit.com' },
  { source: 'AI search query', date: '2025-04-24', text: 'Wat is de opzegtermijn van een autoverzekering in Nederland?', competitor: '', url: '' },

  // Monthly premium (5)
  { source: 'AI search query', date: '2025-04-25', text: 'Waarom is mijn autoverzekeringspremie zo hoog gestegen dit jaar?', competitor: '', url: '' },
  { source: 'Review platform', date: '2025-04-26', text: 'Maandpremie bij Allianz Direct is flink gestegen dit jaar, overweeg te wisselen', competitor: 'Allianz Direct', url: 'trustpilot.com' },
  { source: 'Reddit', date: '2025-04-27', text: 'Premie verhoogd zonder goede reden door ANWB, echt belachelijk hoe dit werkt', competitor: 'ANWB', url: 'reddit.com' },
  { source: 'Tweakers', date: '2025-04-28', text: 'Hoe verlaag ik mijn maandelijkse autoverzekeringspremie zonder in te leveren op dekking?', competitor: '', url: 'tweakers.net' },
  { source: 'AI search query', date: '2025-04-29', text: 'Autoverzekeringspremie te hoog, welke aanpassingen kan ik zelf doen?', competitor: '', url: '' },

  // Coverage after accident (4)
  { source: 'AI search query', date: '2025-05-01', text: 'Wat dekt mijn verzekering als ik schuldig ben aan een aanrijding?', competitor: '', url: '' },
  { source: 'Tweakers', date: '2025-05-02', text: 'Auto total loss verklaard na ongeluk, hoe werkt de uitkering bij mijn verzekering?', competitor: 'Centraal Beheer', url: 'tweakers.net' },
  { source: 'Reddit', date: '2025-05-03', text: 'Ben ik gedekt als de andere partij helemaal niet verzekerd blijkt te zijn?', competitor: '', url: 'reddit.com' },
  { source: 'AI search query', date: '2025-05-04', text: 'Krijg ik volledige schade vergoeding als ik niet schuldig was aan het ongeluk?', competitor: '', url: '' },

  // Cheap car insurance (8)
  { source: 'Reddit', date: '2025-03-10', text: 'Welke autoverzekering is het goedkoopst voor een auto van 5 jaar oud?', competitor: 'InShared', url: 'reddit.com/r/financieel' },
  { source: 'Google Autocomplete', date: '2025-03-11', text: 'goedkoopste autoverzekering Nederland 2025 vergelijken', competitor: '', url: '' },
  { source: 'AI search query', date: '2025-03-12', text: 'Wat is de goedkoopste autoverzekering voor een gezin met twee auto\'s?', competitor: 'Independer', url: '' },
  { source: 'Tweakers', date: '2025-03-15', text: 'Ik betaal nu €89 per maand, is er een betaalbaar alternatief voor mijn budget?', competitor: 'Centraal Beheer', url: 'tweakers.net/forum/auto' },
  { source: 'Review platform', date: '2025-03-18', text: 'De premie bij ANWB is veel te hoog vergeleken met goedkopere aanbieders', competitor: 'ANWB', url: 'trustpilot.com' },
  { source: 'Reddit', date: '2025-03-20', text: 'Vergelijkingssite zegt InShared goedkoopst is, kloppen die prijzen ook echt?', competitor: 'InShared', url: 'reddit.com/r/autoverzekering' },
  { source: 'AI search query', date: '2025-03-22', text: 'Hoe kan ik kosten besparen op mijn autoverzekering zonder kwaliteit te verliezen?', competitor: '', url: '' },
  { source: 'YouTube comments', date: '2025-03-25', text: 'Van Univé naar FBTO overgestapt en bespaar nu 30 euro per maand, aanrader!', competitor: 'Univé', url: 'youtube.com' },
]

export function sampleDataToCSV(): string {
  const headers = ['source', 'date', 'text', 'competitor', 'url']
  const rows = sampleData.map(e => [
    e.source,
    e.date,
    `"${e.text.replace(/"/g, '""')}"`,
    e.competitor,
    e.url,
  ])
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}
