import type { ContentDraft } from '@/types/agent3'

// GEO/AEO items are the same for every draft — explains WHY each element helps
export const geoItems = [
  { item: 'Clear H1 with primary keyword',      reason: 'AI engines use the H1 to identify the page topic and match it to incoming queries.' },
  { item: 'Direct answer block near the top',   reason: 'AI tools extract short, direct answers from the first visible content on a page.' },
  { item: 'FAQ section with schema markup',     reason: 'FAQPage schema enables AI to cite individual Q&As directly in generated answers.' },
  { item: 'Comparison table or checklist',      reason: 'Structured data is easily parsed and quoted by AI engines as authoritative comparisons.' },
  { item: 'Plain, scannable language',          reason: 'AI tools prefer unambiguous, jargon-free language when constructing citations.' },
  { item: 'H2 section hierarchy',               reason: 'Clear headings help AI understand content organization and select the most relevant section.' },
  { item: 'Dutch insurance terminology',        reason: 'Correct local terms (WA, all-risk, no-claim) match Dutch user query patterns exactly.' },
  { item: 'Last reviewed date on page',         reason: 'AI engines prefer recently updated content and often show the date in results.' },
  { item: 'Schema markup implemented',          reason: 'Schema (FAQPage, HowTo, Article) directly signals content structure to AI indexing systems.' },
]

// Opportunities list — matches Agent 2 IDs
export const draftOpportunities = [
  { id: 'young-drivers',  label: 'Young Drivers',                    intentStage: 'Consideration', gapLevel: 'High'   as const, priorityScore: 87 },
  { id: 'coverage-type',  label: 'WA vs WA+ vs All-risk',           intentStage: 'Comparison',    gapLevel: 'High'   as const, priorityScore: 82 },
  { id: 'ev-insurance',   label: 'Electric Vehicle Insurance',      intentStage: 'Awareness',     gapLevel: 'High'   as const, priorityScore: 91 },
  { id: 'claim-handling', label: 'Claim Handling After Accident',   intentStage: 'Post-purchase / Claim', gapLevel: 'Medium' as const, priorityScore: 76 },
  { id: 'switching',      label: 'Switching After Premium Increase', intentStage: 'Purchase',      gapLevel: 'High'   as const, priorityScore: 88 },
]

// Draft template content — all sections written in answer-first format
// [PLACEHOLDER] marks anything requiring OHRA-specific proof before publishing
type DraftTemplate = Omit<ContentDraft, 'opportunityId' | 'opportunityLabel' | 'generatedAt' | 'status' | 'geoItems'>

export const draftTemplates: Record<string, DraftTemplate> = {

  // ─────────────────────────────────────────────────────────────────────────
  'young-drivers': {
    h1: 'Best Car Insurance for Young Drivers in the Netherlands (2025)',
    intro: `Finding affordable car insurance as a young driver in the Netherlands can feel like an uphill battle. Premiums for drivers under 25 are typically higher — sometimes double the rate for older drivers — due to the statistically higher risk profile of new drivers. But with the right information, you can make a confident, cost-effective choice.\n\nThis guide explains your coverage options, shows you how to lower your premium, and helps you understand what to look for when comparing Dutch car insurers. [Last reviewed: {DATE — requires quarterly update}]`,
    answerBlock: `Choosing car insurance as a young driver in the Netherlands is often expensive, but the right choice depends on your car's age, your budget, and your risk profile. Most young drivers start with WA (third-party only) or WA+ for older cars, and consider All-risk for newer or financed vehicles. Comparing insurers directly typically delivers the best premium. Building a no-claim history from year one is the fastest way to reduce costs over time.`,
    sections: [
      {
        heading: 'Why car insurance costs more for young drivers',
        body: `Dutch insurers base premiums on statistical risk. Drivers aged 18–24 have a measurably higher rate of accidents and claims than experienced drivers. This results in an age surcharge — an additional amount on top of the base premium — that applies until you build a track record of claim-free driving.\n\nThe good news: this surcharge decreases every year you drive without a claim. After five to seven claim-free years, the age factor becomes much less significant, and your premium begins to reflect your actual driving record rather than your age group alone.`,
      },
      {
        heading: 'WA, WA+ or All-risk: which coverage do young drivers need?',
        body: `Dutch law requires a minimum of WA (Wettelijke Aansprakelijkheid) — third-party liability insurance. WA covers damage you cause to others, but not damage to your own vehicle. WA+ adds coverage for your own car if it is damaged by theft, fire, weather, or collision with an animal. All-risk covers everything in WA+, plus damage caused by your own fault.\n\nFor a first car that is several years old and lower in value, WA is usually the most practical choice. For a newer or financed car, your lender may require WA+ or All-risk, and the higher replacement value makes the extra cost worthwhile.`,
      },
      {
        heading: 'How to lower your premium as a young driver',
        body: `Several practical steps can reduce your premium:\n\n• Choose a car with a lower power output — sports and performance cars attract higher premiums.\n• Accept a higher voluntary excess (eigen risico) in exchange for a lower monthly payment.\n• Pay your annual premium in full — monthly payment plans typically include a surcharge.\n• Compare quotes directly — prices vary significantly between insurers for the same coverage level.\n• Start building your no-claim record from day one and protect it carefully.\n\n[PLACEHOLDER — Verify whether OHRA offers additional young driver discounts. Requires product team confirmation before publishing.]`,
        requiresProof: true,
      },
      {
        heading: 'What to check before you choose your insurer',
        body: `Before signing up, verify these five points with any insurer:\n\n1. No-claim structure: how many levels are there, and what happens if you make one claim?\n2. Cancellation terms: can you switch at renewal, and what notice is required?\n3. Roadside assistance: is pechhulp included, and does it cover you abroad?\n4. Claims process: how do you report damage, and what is the average handling time?\n5. Customer reviews: check independent review platforms for claims handling reputation.\n\nThese factors often matter more than the headline premium, particularly if you ever need to make a claim.`,
      },
      {
        heading: 'What OHRA offers young drivers',
        body: `[PLACEHOLDER — This entire section requires current, compliance-approved OHRA product information before publishing. Do not publish without sign-off.]\n\nSuggested topics to cover once verified:\n• Current premium range for age bracket 18–25\n• Available coverage levels and add-ons\n• No-claim discount structure and protector option\n• Online quote and policy management\n• Contact and claims channels\n\nNote: Do not make comparative claims ("OHRA is cheaper than X") without current competitor data and legal approval.`,
        requiresProof: true,
      },
    ],
    comparisonTable: {
      caption: 'Coverage comparison: WA vs WA+ vs All-risk',
      headers: ['Coverage Type', 'What It Covers', 'What It Excludes', 'Best Suited For'],
      rows: [
        ['WA', 'Damage to others (vehicles, property, injuries)', 'Your own vehicle damage', 'Cars older than 7 years / low value'],
        ['WA+', 'WA + theft, fire, weather, glass, animal collision', 'Your own fault accidents', 'Cars 4–7 years old / mid-range value'],
        ['All-risk', 'WA+ + your own fault damage', 'Mechanical failure, wear and tear', 'Cars under 4 years old / financed / high value'],
      ],
    },
    faq: [
      { question: 'Why is car insurance more expensive for young drivers?',        answer: 'Insurers base premiums on statistical risk. Drivers under 25 have a higher rate of accidents and claims than experienced drivers, resulting in an age surcharge on top of the base premium.' },
      { question: 'What coverage level is best for a first car?',                  answer: 'For a first car (typically older and lower in value), WA is usually the most cost-effective choice. If your car is newer or financed, your lender may require WA+ or All-risk.' },
      { question: 'Can I reduce my premium as a young driver?',                    answer: 'Yes. Choose a lower-powered car, accept a higher voluntary excess, pay annually rather than monthly, and compare quotes across multiple insurers. Building no-claim history from year one is the most effective long-term strategy.' },
      { question: 'Will I lose my no-claim discount if I switch insurers?',        answer: 'No. Your no-claim history is recorded in the Dutch Bonus-Malus register and transfers to any new insurer. Switching does not reset your no-claim discount.' },
      { question: 'Do I need to inform my insurer about points on my licence?',    answer: 'Yes. Most policies require disclosure of driving convictions. Failure to disclose can give the insurer grounds to void your policy at the time of a claim.' },
      { question: 'What happens to my premium after making a claim?',              answer: 'After a claim your no-claim level drops and your premium typically rises at renewal. A no-claim protector add-on can prevent this step-back after one claim per year.' },
    ],
    cta: `Ready to find out how much car insurance would cost for you? [PLACEHOLDER: link to OHRA quote page] Get a no-obligation quote from OHRA in a few minutes — no paperwork, no phone calls required.`,
    complianceNotes: [
      'All premium examples must be verified against current OHRA pricing data before publishing.',
      'Coverage descriptions must match current OHRA policy documents exactly.',
      'The "What OHRA offers young drivers" section must not be published without compliance sign-off.',
      'No comparison claims ("OHRA is cheaper/better than X") without current competitor data and legal approval.',
      'No-claim discount percentages and structure require verification against current policy terms.',
      'CTA link placeholder must be replaced with the correct OHRA quote URL.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  'coverage-type': {
    h1: 'WA, WA+ or All-risk: Which Car Insurance Suits You? (Netherlands 2025)',
    intro: `Every car owner in the Netherlands must choose between three levels of car insurance coverage: WA, WA+, and All-risk. The decision affects both your monthly premium and how much financial protection you have if something goes wrong.\n\nThis guide explains exactly what each level covers, helps you identify the right choice for your situation, and answers the most common questions Dutch drivers ask. [Last reviewed: {DATE}]`,
    answerBlock: `In the Netherlands, car insurance comes in three levels: WA (mandatory third-party liability), WA+ (adds own damage from external causes like theft, weather, or animal collision), and All-risk (covers your own fault damage too). The right level depends mainly on your car's age and value. For cars under four years old, All-risk is usually worth the extra cost. For cars older than seven years, WA is often sufficient. WA+ offers a practical middle ground.`,
    sections: [
      {
        heading: 'WA — the legal minimum',
        body: `WA (Wettelijke Aansprakelijkheid) is the only legally required car insurance in the Netherlands. It covers damage you cause to other people — their vehicles, property, or personal injuries. Without WA, you cannot legally drive on Dutch roads.\n\nWA does not cover any damage to your own vehicle, regardless of the cause. If you damage your own car in an accident where you are at fault, WA provides no financial protection. For this reason, WA is most appropriate when your car's current market value is low enough that self-insuring the risk is acceptable.`,
      },
      {
        heading: 'WA+ — the practical middle option',
        body: `WA+ extends the basic WA coverage to include damage to your own vehicle caused by external events outside your control. Typical WA+ additions include: theft, fire, storm or hail damage, glass breakage, and collisions with animals.\n\nWA+ does not cover damage caused by your own fault. If you reverse into a wall or cause a collision, WA+ will not pay for repairs to your own car. This makes WA+ a sensible choice for cars in the mid-range — old enough that full All-risk coverage is not cost-effective, but valuable enough to warrant protection against theft or weather events.`,
      },
      {
        heading: 'All-risk — full coverage',
        body: `All-risk (also called volledig casco) includes everything in WA+ and adds coverage for damage to your own car when you are at fault. This includes single-vehicle accidents, parking damage, and situations where the other party cannot be identified.\n\nAll-risk is the most expensive coverage level and is generally recommended for cars that are new, high-value, or still being financed. Many lenders require All-risk as a condition of a car loan or lease agreement. As a car ages and its value decreases, the cost of All-risk coverage relative to the car's worth makes it progressively less cost-effective.`,
      },
      {
        heading: 'When to switch coverage levels',
        body: `A commonly used Dutch rule of thumb: consider downgrading from All-risk to WA+ when your car is 5–7 years old, and from WA+ to WA when it reaches 8–10 years old or when its value drops below approximately €5,000.\n\nThe right moment depends on your specific car, its current market value, and how much of a financial risk you are willing to carry yourself. Comparing the annual premium difference against the car's replacement value is a practical way to make this decision.\n\n[PLACEHOLDER — If OHRA offers a coverage recommendation tool or calculator, link here. Requires product team confirmation.]`,
        requiresProof: true,
      },
    ],
    comparisonTable: {
      caption: 'Side-by-side coverage comparison',
      headers: ['', 'WA', 'WA+', 'All-risk'],
      rows: [
        ['Damage to others', '✓', '✓', '✓'],
        ['Your own car (theft, fire, weather)', '✗', '✓', '✓'],
        ['Your own fault damage', '✗', '✗', '✓'],
        ['Glass breakage', '✗', '✓', '✓'],
        ['Best for car age', '>7 years', '4–7 years', '<4 years'],
      ],
    },
    faq: [
      { question: 'What is the minimum car insurance required in the Netherlands?',   answer: 'WA (Wettelijke Aansprakelijkheid) is the legal minimum. It covers damage you cause to other people and their property, but not damage to your own vehicle.' },
      { question: 'Is All-risk worth it for a 5-year-old car?',                      answer: 'It depends on the car\'s current market value. If the annual All-risk premium exceeds roughly 10% of the car\'s value, WA+ may offer better cost-efficiency.' },
      { question: 'What does WA+ cover that basic WA does not?',                     answer: 'WA+ typically adds coverage for theft, fire, weather damage, glass breakage, and collisions with animals. Damage you cause yourself is still not covered.' },
      { question: 'Can I change my coverage level at any time?',                     answer: 'You can usually upgrade coverage at any time. Downgrading is typically only possible at your annual renewal date or in specific circumstances such as a car sale.' },
      { question: 'Does WA+ cover a hit-and-run in a car park?',                    answer: 'It depends on your policy. Many WA+ policies cover damage from an unidentified third party if you can show evidence. Always confirm this with your insurer.' },
    ],
    cta: `Not sure which coverage level is right for your car? [PLACEHOLDER: link to OHRA quote or coverage tool] Calculate your options with OHRA and find the level that fits your car's value and your budget.`,
    complianceNotes: [
      'Coverage descriptions must match current OHRA policy terms exactly — do not paraphrase policy conditions.',
      'The "rule of thumb" age guidance (5–7 years) is industry convention, not OHRA-specific — label it clearly.',
      'Any coverage recommendation tool or calculator link requires product team verification.',
      'No competitor comparisons without current market data and legal approval.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  'ev-insurance': {
    h1: 'Car Insurance for Electric Vehicles in the Netherlands: What You Need to Know (2025)',
    intro: `The number of electric vehicles on Dutch roads is growing rapidly, and with it, the number of questions about EV-specific insurance. Insuring an electric car is similar to insuring a petrol vehicle in many ways — but there are important differences that most standard policies do not clearly address.\n\nThis page answers the most common EV insurance questions for Dutch drivers, including battery coverage, charging cable protection, and roadside assistance. [Last reviewed: {DATE}]`,
    answerBlock: `Insuring an electric vehicle in the Netherlands is similar to insuring a petrol car, but with important differences. EV-specific risks include battery damage, charging cable theft, and roadside assistance for charging emergencies. Many standard policies exclude battery degradation, so reviewing the fine print is essential. All-risk coverage is strongly recommended for new EVs due to their high replacement value. As the Dutch EV market grows, more insurers are developing purpose-built EV policies.`,
    sections: [
      {
        heading: 'How EV insurance differs from petrol car insurance',
        body: `The fundamental insurance structure — WA, WA+, All-risk — is the same for electric vehicles as for petrol cars. The key differences relate to the specific risks that come with electric vehicles: high-value battery packs, charging infrastructure, and different roadside failure modes.\n\nEV repair costs can be significantly higher than for equivalent petrol cars due to the complexity of electric drivetrains and battery systems. This is an important factor when deciding your coverage level — All-risk is almost always the right choice for a new or recent EV.`,
      },
      {
        heading: 'Is EV battery damage covered by standard car insurance?',
        body: `This depends on the cause of the damage. Physical damage to the battery from a collision is typically covered by All-risk and sometimes WA+, in the same way as any other vehicle damage. Battery degradation over time — the gradual loss of capacity that affects all lithium-ion batteries — is not covered by any standard car insurance policy, as it is considered normal wear.\n\nAlways check your policy document for specific EV exclusions. Some policies contain broad exclusions for "electrical components" that could affect battery damage claims in unexpected ways. If in doubt, ask your insurer for a written clarification.`,
      },
      {
        heading: 'Charging cable theft and charging infrastructure',
        body: `Charging cable theft is an increasingly common concern for Dutch EV owners. Whether your charging cable is covered by car insurance depends on your specific policy. Some insurers include it as an accessory; others exclude cables explicitly.\n\nDamage to or caused by a home charging station (wallbox) is generally not covered by car insurance — this falls under home or contents insurance. Damage caused to a public charging station is covered by your WA as damage to third-party property.\n\n[PLACEHOLDER — Confirm OHRA's current position on charging cable coverage. Requires policy team sign-off before publishing.]`,
        requiresProof: true,
      },
      {
        heading: 'Roadside assistance for electric vehicles',
        body: `Standard pechhulp (roadside assistance) is designed for mechanical breakdowns. For electric vehicles, running out of charge on a motorway is a different problem — the car is not broken, it just needs electricity. Not all roadside assistance plans cover range emergencies.\n\nWhen evaluating roadside assistance as an EV owner, specifically check: Does it cover transport to the nearest charging station if you run out of charge? Does it cover charging emergencies abroad? What is the response time?\n\n[PLACEHOLDER — Confirm OHRA roadside assistance terms for EV customers. Do not publish this section without confirmation.]`,
        requiresProof: true,
      },
    ],
    faq: [
      { question: 'Does standard car insurance cover EV battery damage?',          answer: 'Physical damage from a collision is typically covered by All-risk and sometimes WA+. Battery degradation over time is not covered by any standard policy, as it is considered normal wear.' },
      { question: 'Is charging cable theft covered by car insurance?',             answer: 'It depends on the policy. Some insurers include charging cables as an insured accessory; others exclude them. Always check your policy terms or ask for written confirmation.' },
      { question: 'Do I need All-risk insurance for a new electric vehicle?',      answer: 'For a new EV — which can cost €30,000–€80,000 or more — All-risk is strongly recommended due to the high replacement cost and expensive battery systems.' },
      { question: 'Does roadside assistance cover running out of charge?',         answer: 'Not always. Standard pechhulp covers mechanical breakdowns but may not cover range emergencies. Specifically check whether your insurer\'s assistance plan includes transport to a charger.' },
      { question: 'Is a leased EV insured the same way as a privately owned one?', answer: 'For a leased EV, the leasing company typically sets the minimum required coverage level, often All-risk. Check your lease contract before purchasing insurance separately.' },
    ],
    cta: `Looking for car insurance for your electric vehicle? [PLACEHOLDER: link to OHRA EV insurance page or quote flow] Get a quote from OHRA and find out exactly what your EV is covered for.`,
    complianceNotes: [
      'Battery coverage statements must be verified against current OHRA policy documents — EV exclusions vary significantly between policies.',
      'Charging cable and wallbox coverage must be explicitly confirmed with the OHRA policy team.',
      'Roadside assistance EV-specific terms must be verified before publishing.',
      'Do not state specific premium examples for EV models without current pricing data.',
      'The statement "All-risk is strongly recommended" should be labelled as editorial guidance, not an OHRA recommendation, unless compliance approves it as an explicit product recommendation.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  'claim-handling': {
    h1: 'What to Do After a Car Accident in the Netherlands: Step-by-Step Guide',
    intro: `Being in a car accident is stressful. Knowing exactly what to do in the minutes and hours afterwards can make a significant difference to both your safety and your insurance claim. This guide walks you through every step, from securing the scene to understanding how long a claim takes to resolve.\n\n[Last reviewed: {DATE}]`,
    answerBlock: `After a car accident in the Netherlands, secure the scene first and check for injuries. Exchange details with the other driver and complete a schadeformulier (accident report form). Report the claim to your insurer within three business days, with photos and witness details if available. Your insurer will assess the damage and communicate next steps. Straightforward claims are typically resolved within two to four weeks. If the other party was at fault and is insured, their insurer covers your repair costs.`,
    sections: [
      {
        heading: 'Step 1 — Secure the scene and check for injuries',
        body: `Switch on your hazard lights immediately and, if safe to do so, move your vehicle to the side of the road. Check whether anyone is injured. If there are injuries, call 112 immediately — do not attempt to move injured people unless they are in immediate danger.\n\nIf there are no injuries and the vehicles can be moved safely, clear the road. Take photos of the vehicle positions before moving them. Note the time, exact location, road conditions, and weather.`,
      },
      {
        heading: 'Step 2 — Exchange details and complete the schadeformulier',
        body: `Always carry a European Accident Report Form (schadeformulier / constat amiable) in your vehicle. Both drivers complete and sign the form together at the scene. The form records: driver details, vehicle registration, insurance details, a diagram of the accident, and an agreed account of what happened.\n\nIf the other driver refuses to complete the form or drives away, note their licence plate, make, model, and colour. Call the police if the other driver is uncooperative, injured, or has caused significant damage.`,
      },
      {
        heading: 'Step 3 — Report the claim to your insurer',
        body: `Contact your insurer as soon as possible after the accident — most Dutch policies require you to report within three to seven days. Delaying a claim without reason can affect your coverage.\n\nWhen reporting, provide: the completed schadeformulier, photos of the damage, your policy number, and the other driver's details. [PLACEHOLDER — Confirm OHRA's exact claim reporting channels and deadline. Include correct phone number/app/online portal before publishing.]`,
        requiresProof: true,
      },
      {
        heading: 'Step 4 — Claims assessment and resolution',
        body: `After you report your claim, your insurer appoints a damage assessor (schadexpert) who inspects your vehicle and estimates repair costs. For minor damage, this may be done via photos. For significant damage, an in-person inspection is arranged.\n\nSimple claims with clear liability — where the other party is clearly at fault and insured — are typically resolved in one to four weeks. Complex claims involving disputed liability, injuries, or uninsured parties can take considerably longer.\n\n[PLACEHOLDER — Add OHRA's average claim handling time if available. Do not include without verified data.]`,
        requiresProof: true,
      },
      {
        heading: 'What happens to your no-claim discount after a claim?',
        body: `Making a claim typically causes your no-claim level to drop, resulting in a higher premium at your next renewal. The exact step-back depends on your insurer's bonus-malus structure.\n\nA no-claim protector add-on (beschermer) allows one claim per year without your no-claim level dropping. Whether this add-on is worth the additional cost depends on your current no-claim level and the likelihood of future claims.`,
      },
    ],
    comparisonTable: {
      caption: 'Typical claim timelines by type',
      headers: ['Claim Type', 'Typical Resolution Time', 'Notes'],
      rows: [
        ['Clear liability, no injury', '1–4 weeks', 'Fastest category when both parties are insured'],
        ['Disputed liability', '4–12 weeks', 'May require independent arbitration'],
        ['Physical injury involved', '3–12+ months', 'Timeline depends on medical assessment'],
        ['Hit-and-run (no other party)', '2–6 weeks', 'Requires police report in most cases'],
        ['Total loss (auto total loss)', '2–4 weeks', 'Valuation agreed with damage assessor'],
      ],
    },
    faq: [
      { question: 'What is a schadeformulier and do I need one?',               answer: 'A schadeformulier is a standardized European accident report form. Both drivers complete and sign it at the scene to document what happened. Always carry one in your vehicle — it significantly speeds up the claims process.' },
      { question: 'How quickly do I need to report a claim?',                   answer: 'Most Dutch insurers require a claim to be reported within 3–7 days. Check your policy terms. Significant delays can affect your coverage.' },
      { question: 'What if the other driver leaves without giving details?',    answer: 'Note their licence plate and call the police. Your insurer should be informed immediately. Depending on your coverage, you may still be able to claim under your own policy.' },
      { question: 'Will my premium increase after a claim?',                    answer: 'Yes, in most cases. A claim causes your no-claim level to drop, raising your premium at renewal. A no-claim protector add-on can limit this impact.' },
      { question: 'Can I choose my own repair garage?',                         answer: 'This depends on your policy. Some policies allow free choice of garage; others require you to use an approved repair partner. Check your policy terms before booking repairs.' },
    ],
    cta: `Need to report a claim right now? [PLACEHOLDER: OHRA claims contact number and online portal link] OHRA's claims team is available [PLACEHOLDER: hours — requires confirmation]. You can also report a claim online through your OHRA account.`,
    complianceNotes: [
      'OHRA claim reporting channels, contact numbers, and deadlines must be verified by the product team before publishing.',
      'Average claim handling times require verified OHRA data — do not estimate or compare without evidence.',
      'The no-claim step-back structure must match OHRA\'s current bonus-malus table exactly.',
      'CTA opening hours and portal links are placeholders — replace with current, accurate OHRA information.',
      'Legal nuances around disputed liability and injury claims should be reviewed by a legal team.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  'switching': {
    h1: 'How to Switch Car Insurance in the Netherlands: Easy Step-by-Step Guide (2025)',
    intro: `Switching car insurance in the Netherlands is easier than most people expect — and it can result in significant savings. Whether you have received a premium increase notice, are simply unhappy with your current insurer, or have found a better deal elsewhere, this guide explains exactly how and when you can switch.\n\n[Last reviewed: {DATE}]`,
    answerBlock: `Switching car insurance in the Netherlands is possible at your annual renewal date, or immediately in specific situations such as a premium increase, car sale, or relocation. Most policies require 30 days written notice before cancellation. To switch: compare alternatives, confirm your new insurer's start date, cancel your current policy in writing, and transfer your no-claim certificate. The entire process can be completed online in under an hour.`,
    sections: [
      {
        heading: 'When can you switch car insurance in the Netherlands?',
        body: `The most straightforward time to switch is at your annual renewal date. Your insurer will send a renewal notice approximately 30 days before your policy expires — this is the standard window to switch.\n\nYou can also switch mid-year in specific situations: if your insurer raises your premium, if you sell your car, if you move abroad, or if your personal situation changes significantly. Dutch consumer protection rules give you the right to cancel within 30 days of receiving a premium increase notice.`,
      },
      {
        heading: 'Your right to cancel after a premium increase',
        body: `If your insurer notifies you of a premium increase, Dutch consumer law entitles you to cancel your policy within 30 days of receiving the notice, even if you are mid-policy year. This is one of the strongest consumer rights in Dutch insurance — it means that a premium increase you consider unfair is effectively always an opportunity to switch.\n\nTo exercise this right: contact your insurer in writing within 30 days of the notice, stating that you are cancelling due to the premium increase. Your new policy should start on the day your old policy ends to avoid a gap in coverage.`,
      },
      {
        heading: 'Step-by-step: how to switch car insurance',
        body: `1. Compare alternatives — use a comparison tool or contact insurers directly for quotes.\n2. Choose your new insurer and confirm the exact start date of your new policy.\n3. Cancel your current policy in writing — email or registered letter — giving at least 30 days notice where required.\n4. Confirm your no-claim level — your new insurer will request your no-claim certificate (schadevrij bewijs) directly from the Dutch Bonus-Malus register.\n5. Receive confirmation from your new insurer that coverage is active from the agreed start date.\n\n[PLACEHOLDER — If OHRA offers a switching service that handles cancellation for the customer, describe this process here after product team confirmation.]`,
        requiresProof: true,
      },
      {
        heading: 'What happens to your no-claim discount when you switch?',
        body: `Your no-claim discount does not disappear when you switch insurers. In the Netherlands, no-claim history is recorded in the central Bonus-Malus register. Your new insurer will request your no-claim certificate automatically — you do not need to contact your old insurer separately.\n\nThis means switching has no negative effect on your no-claim status, which is one of the main concerns that prevents Dutch drivers from switching. You keep every year of claim-free driving you have accumulated, regardless of which insurer holds your policy.`,
      },
    ],
    comparisonTable: {
      caption: 'When you can switch and what you need',
      headers: ['Switching Reason', 'Can You Switch?', 'Notice Required', 'Key Document'],
      rows: [
        ['Annual renewal',        'Yes — standard window', '30 days before renewal', 'Renewal notice from current insurer'],
        ['Premium increase',      'Yes — within 30 days',  '30 days from notice',   'Premium increase notification'],
        ['Car sale',              'Yes — immediately',      'Day of sale',           'Sale agreement / new registration'],
        ['Move abroad',           'Yes',                    '30 days',               'Proof of new address/residency'],
        ['General dissatisfaction', 'At renewal only',      '30 days before renewal', 'Renewal notice'],
      ],
    },
    faq: [
      { question: 'Will I lose my no-claim discount when I switch insurer?',    answer: 'No. Your no-claim history is stored in the Dutch Bonus-Malus register and transfers automatically to any new insurer. You do not lose your accumulated discount by switching.' },
      { question: 'Can I switch immediately after a premium increase?',         answer: 'Yes. Dutch consumer law gives you the right to cancel within 30 days of receiving a premium increase notice, even mid-policy year.' },
      { question: 'How much notice do I need to give my current insurer?',      answer: 'Most policies require 30 days written notice. Check your policy documents for the exact cancellation terms, as this can vary.' },
      { question: 'Is there a gap in coverage when switching insurers?',        answer: 'Not if you coordinate the dates correctly. Confirm your new policy start date matches the day your old policy ends. Your new insurer can arrange this.' },
      { question: 'What documents do I need to switch car insurance?',          answer: 'Typically: your current policy number, vehicle registration details, and driving licence. Your new insurer will request the no-claim certificate from the Bonus-Malus register directly.' },
    ],
    cta: `Ready to switch to OHRA? [PLACEHOLDER: link to OHRA switch page or quote flow] Get a quote in minutes and see what you could save. OHRA will take care of the cancellation process [PLACEHOLDER — confirm this if OHRA offers a switching service].`,
    complianceNotes: [
      'The 30-day cancellation right after a premium increase is a consumer law right — cite the relevant Dutch regulation (Burgerlijk Wetboek / Wet op het financieel toezicht) if possible. Legal review required.',
      'OHRA\'s specific switching process and whether they handle cancellation for customers requires product team confirmation before publishing.',
      'No savings claims ("switch and save X%") without current, verified data.',
      'CTA link is a placeholder — replace with correct OHRA URL before publishing.',
    ],
  },
}
