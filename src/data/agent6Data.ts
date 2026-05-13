import type { Mention } from '@/types/agent6'

// Fake sample mention data — no real scraping, no real claims.
// Designed to show OHRA gaps in: young drivers, EV, cheap insurance.
// OHRA has stronger presence in: claim handling, customer service.

const R = 'Reddit'
const TW = 'Tweakers'
const YT = 'YouTube'
const REV = 'Review platform'
const CMP = 'Comparison website'
const NEWS = 'Dutch news site'
const AI = 'AI answer citation'

const CHEAP = 'Cheap car insurance'
const YOUNG = 'Young drivers'
const EV = 'EV insurance'
const WA = 'WA vs All-risk'
const CLAIM = 'Claim handling'
const SWITCH = 'Switching insurance'
const NOCLAIM = 'No-claim discount'
const SERVICE = 'Customer service'

export const mentions: Mention[] = [
  // ── CHEAP CAR INSURANCE ─────────────────────────────────────────────────
  { id: 'm01', source: CMP,  date: '2025-01-10', text: 'Independer toont de goedkoopste autoverzekeringen van Nederland.', brands: ['Independer'], topic: CHEAP, sentiment: 'Positive', authorityScore: 85, url: 'https://www.independer.nl/autoverzekering' },
  { id: 'm02', source: R,    date: '2025-01-15', text: 'Ik gebruik altijd Independer om te vergelijken. Goedkoopste optie vinden is makkelijk.', brands: ['Independer'], topic: CHEAP, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/financien' },
  { id: 'm03', source: R,    date: '2025-01-20', text: 'Ik zie vaak Independer en ANWB genoemd, maar weinig over OHRA.', brands: ['Independer', 'ANWB', 'OHRA'], topic: CHEAP, sentiment: 'Neutral', authorityScore: 70, url: 'https://reddit.com/r/financien' },
  { id: 'm04', source: TW,   date: '2025-02-01', text: 'FBTO is goedkoop maar InShared kan nog goedkoper uitvallen als je weinig rijdt.', brands: ['FBTO', 'InShared'], topic: CHEAP, sentiment: 'Neutral', authorityScore: 75, url: 'https://tweakers.net/forum' },
  { id: 'm05', source: NEWS, date: '2025-02-05', text: 'Nederlanders vergelijken autoverzekeringen vaker online via vergelijkingssites.', brands: ['Independer'], topic: CHEAP, sentiment: 'Neutral', authorityScore: 90, url: 'https://nos.nl/autoverzekering' },
  { id: 'm06', source: CMP,  date: '2025-02-10', text: 'Centraal Beheer biedt scherpe tarieven voor standaard autoverzekeringen.', brands: ['Centraal Beheer'], topic: CHEAP, sentiment: 'Positive', authorityScore: 85, url: 'https://www.independer.nl' },
  { id: 'm07', source: YT,   date: '2025-02-14', text: 'Ik heb de goedkoopste WA gevonden via Independer, snel geregeld.', brands: ['Independer'], topic: CHEAP, sentiment: 'Positive', authorityScore: 55, url: 'https://youtube.com/watch?v=fake01' },
  { id: 'm08', source: R,    date: '2025-02-20', text: 'ANWB vergelijker is ook goed. Ik betaal nu veel minder dan bij mijn vorige verzekeraar.', brands: ['ANWB'], topic: CHEAP, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/geldzaken' },
  { id: 'm09', source: REV,  date: '2025-03-01', text: 'OHRA kon niet concurreren qua prijs met Centraal Beheer voor ons gezin.', brands: ['OHRA', 'Centraal Beheer'], topic: CHEAP, sentiment: 'Negative', authorityScore: 80, url: 'https://trustpilot.com/ohra' },
  { id: 'm10', source: CMP,  date: '2025-03-05', text: 'InShared hanteert een kilometermodel — ideaal voor mensen die weinig rijden.', brands: ['InShared'], topic: CHEAP, sentiment: 'Positive', authorityScore: 85, url: 'https://pricewise.nl' },

  // ── YOUNG DRIVERS ────────────────────────────────────────────────────────
  { id: 'm11', source: R,    date: '2025-01-08', text: 'Als jonge bestuurder ben ik naar Independer gegaan. Beste overzicht voor mijn leeftijd.', brands: ['Independer'], topic: YOUNG, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/financien' },
  { id: 'm12', source: R,    date: '2025-01-12', text: 'Centraal Beheer heeft een goede regeling voor jongeren met een eerste auto.', brands: ['Centraal Beheer'], topic: YOUNG, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/autoverkoop' },
  { id: 'm13', source: TW,   date: '2025-01-18', text: 'Welke verzekeraar is het best voor een 19-jarige? Ik hoor veel over Independer en ANWB.', brands: ['Independer', 'ANWB'], topic: YOUNG, sentiment: 'Neutral', authorityScore: 75, url: 'https://tweakers.net/forum' },
  { id: 'm14', source: YT,   date: '2025-01-25', text: 'Video: autoverzekering voor jonge bestuurders vergelijken in 2025. Centraal Beheer scoort goed.', brands: ['Centraal Beheer'], topic: YOUNG, sentiment: 'Positive', authorityScore: 55, url: 'https://youtube.com/watch?v=fake02' },
  { id: 'm15', source: CMP,  date: '2025-02-02', text: 'Independer rangschikt verzekeraars op premie voor leeftijd 18–25.', brands: ['Independer'], topic: YOUNG, sentiment: 'Neutral', authorityScore: 85, url: 'https://independer.nl/jonge-bestuurder' },
  { id: 'm16', source: NEWS, date: '2025-02-08', text: 'Jonge automobilisten betalen tot drie keer meer premie dan 30-plussers.', brands: ['Centraal Beheer', 'ANWB'], topic: YOUNG, sentiment: 'Neutral', authorityScore: 90, url: 'https://nu.nl/autoverzekering' },
  { id: 'm17', source: REV,  date: '2025-02-15', text: 'OHRA vond ik duurder dan verwacht voor mijn 21-jarige dochter.', brands: ['OHRA'], topic: YOUNG, sentiment: 'Negative', authorityScore: 80, url: 'https://trustpilot.com/ohra' },
  { id: 'm18', source: R,    date: '2025-03-01', text: 'Univé was aangeraden door mijn ouders maar ik kon niets vinden voor jongeren specifiek.', brands: ['Univé'], topic: YOUNG, sentiment: 'Neutral', authorityScore: 70, url: 'https://reddit.com/r/geldzaken' },
  { id: 'm19', source: AI,   date: '2025-03-10', text: 'For young drivers in the Netherlands, Independer and Centraal Beheer are frequently recommended for competitive rates.', brands: ['Independer', 'Centraal Beheer'], topic: YOUNG, sentiment: 'Positive', authorityScore: 95, url: 'https://chatgpt.com/search' },
  { id: 'm20', source: TW,   date: '2025-03-15', text: 'ANWB heeft ook een module voor jongeren. OHRA kom ik bijna niet tegen in vergelijkingen.', brands: ['ANWB', 'OHRA'], topic: YOUNG, sentiment: 'Neutral', authorityScore: 75, url: 'https://tweakers.net/forum' },

  // ── EV INSURANCE ─────────────────────────────────────────────────────────
  { id: 'm21', source: TW,   date: '2025-01-05', text: 'ANWB heeft een goede EV-verzekering met dekking voor laadkabeldiefstal.', brands: ['ANWB'], topic: EV, sentiment: 'Positive', authorityScore: 75, url: 'https://tweakers.net/forum/ev' },
  { id: 'm22', source: TW,   date: '2025-01-10', text: 'Allianz Direct biedt scherpe tarieven voor elektrische auto\'s. Ik ben tevreden.', brands: ['Allianz Direct'], topic: EV, sentiment: 'Positive', authorityScore: 75, url: 'https://tweakers.net/forum/ev' },
  { id: 'm23', source: NEWS, date: '2025-01-20', text: 'Steeds meer verzekeraars bieden specifieke dekking voor EV-batterijschade.', brands: ['ANWB', 'Allianz Direct'], topic: EV, sentiment: 'Neutral', authorityScore: 90, url: 'https://autoweek.nl' },
  { id: 'm24', source: YT,   date: '2025-02-01', text: 'Review: Allianz Direct EV-verzekering. Goede batterijdekking, snelle schadeafhandeling.', brands: ['Allianz Direct'], topic: EV, sentiment: 'Positive', authorityScore: 55, url: 'https://youtube.com/watch?v=fake03' },
  { id: 'm25', source: R,    date: '2025-02-10', text: 'Heeft iemand ervaring met OHRA voor een Tesla? Ik kan weinig info vinden.', brands: ['OHRA'], topic: EV, sentiment: 'Neutral', authorityScore: 70, url: 'https://reddit.com/r/electricvehicles' },
  { id: 'm26', source: CMP,  date: '2025-02-15', text: 'ANWB en Centraal Beheer scoren het best in EV-vergelijkingen op onze site.', brands: ['ANWB', 'Centraal Beheer'], topic: EV, sentiment: 'Positive', authorityScore: 85, url: 'https://pricewise.nl/ev' },
  { id: 'm27', source: REV,  date: '2025-02-20', text: 'OHRA bood mij een normale autoverzekering maar ik zocht iets specifieks voor mijn EV.', brands: ['OHRA'], topic: EV, sentiment: 'Neutral', authorityScore: 80, url: 'https://kiyoh.nl/ohra' },
  { id: 'm28', source: AI,   date: '2025-03-05', text: 'ANWB and Allianz Direct are most frequently cited for EV insurance coverage in the Netherlands.', brands: ['ANWB', 'Allianz Direct'], topic: EV, sentiment: 'Positive', authorityScore: 95, url: 'https://perplexity.ai/search' },
  { id: 'm29', source: TW,   date: '2025-03-12', text: 'Ik mis een duidelijke vergelijking van EV-dekking op de OHRA-site.', brands: ['OHRA'], topic: EV, sentiment: 'Negative', authorityScore: 75, url: 'https://tweakers.net/forum' },
  { id: 'm30', source: R,    date: '2025-03-18', text: 'Centraal Beheer heeft EV uitgebreid in hun pakket. Goed initiatief.', brands: ['Centraal Beheer'], topic: EV, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/electricvehicles' },

  // ── WA VS ALL-RISK ──────────────────────────────────────────────────────
  { id: 'm31', source: CMP,  date: '2025-01-12', text: 'Uitleg: wanneer kies je WA, WA+ of allrisk? Met vergelijkingstabel per situatie.', brands: ['Independer'], topic: WA, sentiment: 'Neutral', authorityScore: 85, url: 'https://independer.nl/wa-vs-allrisk' },
  { id: 'm32', source: R,    date: '2025-01-22', text: 'Independer legt goed uit wat het verschil is tussen WA en allrisk. Begrijpelijke uitleg.', brands: ['Independer'], topic: WA, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/financien' },
  { id: 'm33', source: NEWS, date: '2025-02-02', text: 'Experts adviseren allrisk voor auto\'s jonger dan 5 jaar. ANWB geeft duidelijke uitleg.', brands: ['ANWB'], topic: WA, sentiment: 'Positive', authorityScore: 90, url: 'https://consumentenbond.nl' },
  { id: 'm34', source: TW,   date: '2025-02-12', text: 'Na 6 jaar switch ik naar WA+. Heb dit via de ANWB-calculator berekend.', brands: ['ANWB'], topic: WA, sentiment: 'Positive', authorityScore: 75, url: 'https://tweakers.net/forum' },
  { id: 'm35', source: YT,   date: '2025-02-18', text: 'WA of allrisk? Centraal Beheer legt het simpel uit in deze video.', brands: ['Centraal Beheer'], topic: WA, sentiment: 'Positive', authorityScore: 55, url: 'https://youtube.com/watch?v=fake04' },
  { id: 'm36', source: REV,  date: '2025-02-25', text: 'Ik wilde WA+ en ANWB had dit het duidelijkst uitgelegd op hun site.', brands: ['ANWB'], topic: WA, sentiment: 'Positive', authorityScore: 80, url: 'https://trustpilot.com/anwb' },
  { id: 'm37', source: R,    date: '2025-03-05', text: 'Independer heeft de beste vergelijker voor WA vs allrisk op basis van autowaarde.', brands: ['Independer'], topic: WA, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/geldzaken' },

  // ── CLAIM HANDLING ───────────────────────────────────────────────────────
  { id: 'm38', source: REV,  date: '2025-01-08', text: 'OHRA was easy to contact after my car damage claim. Quick and professional.', brands: ['OHRA'], topic: CLAIM, sentiment: 'Positive', authorityScore: 80, url: 'https://trustpilot.com/ohra' },
  { id: 'm39', source: REV,  date: '2025-01-15', text: 'Schade gemeld bij Centraal Beheer, binnen twee dagen reactie. Tevreden over de service.', brands: ['Centraal Beheer'], topic: CLAIM, sentiment: 'Positive', authorityScore: 80, url: 'https://kiyoh.nl/centralebeheer' },
  { id: 'm40', source: R,    date: '2025-01-25', text: 'Centraal Beheer heeft mijn schade netjes afgehandeld. Had eerder slechte ervaringen bij Univé.', brands: ['Centraal Beheer', 'Univé'], topic: CLAIM, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/financien' },
  { id: 'm41', source: TW,   date: '2025-02-05', text: 'Centraal Beheer schadeafhandeling is traag. Twee weken gewacht op antwoord.', brands: ['Centraal Beheer'], topic: CLAIM, sentiment: 'Negative', authorityScore: 75, url: 'https://tweakers.net/forum' },
  { id: 'm42', source: REV,  date: '2025-02-10', text: 'OHRA schade klacht: mijn claim werd afgewezen zonder duidelijke uitleg.', brands: ['OHRA'], topic: CLAIM, sentiment: 'Negative', authorityScore: 80, url: 'https://trustpilot.com/ohra' },
  { id: 'm43', source: NEWS, date: '2025-02-18', text: 'Consumentenbond: Centraal Beheer en ANWB scoren bovengemiddeld op schadeafhandeling.', brands: ['Centraal Beheer', 'ANWB'], topic: CLAIM, sentiment: 'Positive', authorityScore: 90, url: 'https://consumentenbond.nl' },
  { id: 'm44', source: YT,   date: '2025-02-25', text: 'Ervaring met schade claimen bij Univé: veel gedoe, weinig communicatie.', brands: ['Univé'], topic: CLAIM, sentiment: 'Negative', authorityScore: 55, url: 'https://youtube.com/watch?v=fake05' },
  { id: 'm45', source: R,    date: '2025-03-08', text: 'Centraal Beheer reageerde snel op mijn schademelding. Goed geregeld.', brands: ['Centraal Beheer'], topic: CLAIM, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/financien' },

  // ── SWITCHING INSURANCE ──────────────────────────────────────────────────
  { id: 'm46', source: CMP,  date: '2025-01-14', text: 'Independer maakt overstappen eenvoudig. Stap-voor-stap handleiding aanwezig.', brands: ['Independer'], topic: SWITCH, sentiment: 'Positive', authorityScore: 85, url: 'https://independer.nl/overstappen' },
  { id: 'm47', source: R,    date: '2025-01-28', text: 'Na premieverhoog bij Univé ben ik naar Centraal Beheer gegaan. Eenvoudig proces.', brands: ['Univé', 'Centraal Beheer'], topic: SWITCH, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/geldzaken' },
  { id: 'm48', source: TW,   date: '2025-02-08', text: 'InShared heeft een goede opzegservice en ANWB nam de afhandeling vlot over.', brands: ['InShared', 'ANWB'], topic: SWITCH, sentiment: 'Positive', authorityScore: 75, url: 'https://tweakers.net/forum' },
  { id: 'm49', source: REV,  date: '2025-02-18', text: 'Overstappen van Centraal Beheer naar InShared ging vlot. Premie 15% lager.', brands: ['Centraal Beheer', 'InShared'], topic: SWITCH, sentiment: 'Positive', authorityScore: 80, url: 'https://kiyoh.nl' },
  { id: 'm50', source: R,    date: '2025-03-02', text: 'Independer toont de 30-daagse opzegregel heel duidelijk. Handig overzicht.', brands: ['Independer'], topic: SWITCH, sentiment: 'Neutral', authorityScore: 70, url: 'https://reddit.com/r/financien' },
  { id: 'm51', source: NEWS, date: '2025-03-10', text: 'Nederlanders stappen vaker over na premieverhogingen. Vergelijkers profiteren hiervan.', brands: ['Independer'], topic: SWITCH, sentiment: 'Neutral', authorityScore: 90, url: 'https://rtlnieuws.nl' },
  { id: 'm52', source: YT,   date: '2025-03-15', text: 'Hoe overstap je autoverzekering in 3 stappen? Met Centraal Beheer als voorbeeld.', brands: ['Centraal Beheer'], topic: SWITCH, sentiment: 'Positive', authorityScore: 55, url: 'https://youtube.com/watch?v=fake06' },

  // ── NO-CLAIM DISCOUNT ────────────────────────────────────────────────────
  { id: 'm53', source: R,    date: '2025-01-18', text: 'Centraal Beheer heeft een van de beste no-claimsystemen. Snel opgebouwd.', brands: ['Centraal Beheer'], topic: NOCLAIM, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/financien' },
  { id: 'm54', source: CMP,  date: '2025-02-05', text: 'No-claim vergelijking 2025: Centraal Beheer en ANWB bieden de meest transparante kortingsstructuur.', brands: ['Centraal Beheer', 'ANWB'], topic: NOCLAIM, sentiment: 'Neutral', authorityScore: 85, url: 'https://independer.nl' },
  { id: 'm55', source: REV,  date: '2025-02-12', text: 'Mijn no-claim is zonder problemen overgedragen na overstap naar ANWB.', brands: ['ANWB'], topic: NOCLAIM, sentiment: 'Positive', authorityScore: 80, url: 'https://trustpilot.com/anwb' },
  { id: 'm56', source: TW,   date: '2025-02-20', text: 'Het Bonus-Malus register werkt goed. Centraal Beheer heeft dit netjes verwerkt.', brands: ['Centraal Beheer'], topic: NOCLAIM, sentiment: 'Positive', authorityScore: 75, url: 'https://tweakers.net/forum' },
  { id: 'm57', source: NEWS, date: '2025-03-08', text: 'Uitleg no-claimsysteem Nederland: hoe werkt het Bonus-Malus register?', brands: ['Centraal Beheer'], topic: NOCLAIM, sentiment: 'Neutral', authorityScore: 90, url: 'https://consumentenbond.nl' },

  // ── CUSTOMER SERVICE ─────────────────────────────────────────────────────
  { id: 'm58', source: REV,  date: '2025-01-20', text: 'OHRA klantenservice was vriendelijk en behulpzaam. Probleem snel opgelost.', brands: ['OHRA'], topic: SERVICE, sentiment: 'Positive', authorityScore: 80, url: 'https://kiyoh.nl/ohra' },
  { id: 'm59', source: REV,  date: '2025-01-28', text: 'Centraal Beheer: lange wachttijden aan de telefoon. Onduidelijke communicatie.', brands: ['Centraal Beheer'], topic: SERVICE, sentiment: 'Negative', authorityScore: 80, url: 'https://trustpilot.com/centralebeheer' },
  { id: 'm60', source: R,    date: '2025-02-05', text: 'Centraal Beheer reageerde snel via chat. Tevreden met de klantenservice.', brands: ['Centraal Beheer'], topic: SERVICE, sentiment: 'Positive', authorityScore: 70, url: 'https://reddit.com/r/financien' },
  { id: 'm61', source: YT,   date: '2025-02-12', text: 'Review Centraal Beheer klantenservice 2025: snel, duidelijk en makkelijk bereikbaar.', brands: ['Centraal Beheer'], topic: SERVICE, sentiment: 'Positive', authorityScore: 55, url: 'https://youtube.com/watch?v=fake07' },
  { id: 'm62', source: REV,  date: '2025-02-20', text: 'Univé klantenservice is traag. Mijn aanvraag stond wekenlang open.', brands: ['Univé'], topic: SERVICE, sentiment: 'Negative', authorityScore: 80, url: 'https://trustpilot.com/unive' },
  { id: 'm63', source: TW,   date: '2025-03-05', text: 'Centraal Beheer app werkt goed en de chatfunctie is snel. ANWB heeft betere telefonische service.', brands: ['Centraal Beheer', 'ANWB'], topic: SERVICE, sentiment: 'Positive', authorityScore: 75, url: 'https://tweakers.net/forum' },
  { id: 'm64', source: AI,   date: '2025-03-12', text: 'Centraal Beheer and ANWB are frequently praised for responsive customer service in Dutch insurance reviews.', brands: ['Centraal Beheer', 'ANWB'], topic: SERVICE, sentiment: 'Positive', authorityScore: 95, url: 'https://chatgpt.com/search' },
]

export const BRANDS = ['Independer', 'Centraal Beheer', 'ANWB', 'OHRA', 'Univé', 'InShared', 'Allianz Direct', 'FBTO'] as const
export const TOPICS = [CHEAP, YOUNG, EV, WA, CLAIM, SWITCH, NOCLAIM, SERVICE] as const
export const SOURCE_AUTHORITY: Record<string, number> = {
  [AI]:   95,
  [NEWS]: 90,
  [CMP]:  85,
  [REV]:  80,
  [TW]:   75,
  [R]:    70,
  [YT]:   55,
}
