import type { TechnicalPage } from '@/types/agent5'

// Each page has intentional gaps so the dashboard can show useful warnings.
export const technicalPages: TechnicalPage[] = [
  {
    id: 'young-drivers',
    label: 'Young Drivers',
    intentStage: 'Consideration',
    gapLevel: 'High',
    priorityScore: 87,
    h1: 'Car Insurance for Young Drivers',  // OK but generic
    headings: [
      { level: 2, text: 'Coverage options for young drivers' },
      { level: 2, text: 'How to reduce your premium' },
      { level: 2, text: 'Frequently asked questions' },
      { level: 3, text: 'WA vs WA+ for young drivers' },
    ],
    answerBlock:
      'As a young driver in the Netherlands, you can choose from WA, WA+, or All-risk coverage. Your premium depends on your age, car value, and no-claim history. Most under-25 drivers start with WA or WA+ for older vehicles.',
    targetQuery: 'cheapest car insurance young driver Netherlands',
    faq: [
      { question: 'Why is my premium high as a young driver?', answer: 'Insurers apply an age surcharge because under-25 drivers statistically have more accidents.' },
      { question: 'Can I reduce my premium as a young driver?', answer: 'Yes. Drive carefully, increase your excess, and compare your options annually.' },
      { question: 'Will I lose my no-claim when I switch?', answer: 'No. No-claim transfers automatically via the Dutch Bonus-Malus register.' },
    ],
    // Only 3 FAQs — triggers FAQ warning
    hasComparisonTable: true,
    hasDisclaimer: true,
    hasCTA: true,
    seoTitle: 'Car Insurance for Young Drivers | OHRA',
    metaDescription: 'Compare car insurance options for young drivers in the Netherlands. Find the right coverage from OHRA and start building your no-claim history.',
    slug: 'autoverzekering/jonge-bestuurders',
    lastUpdated: '',  // missing — triggers metadata warning
    internalLinks: ['https://www.ohra.nl/autoverzekering'],
    isHowTo: false,
  },

  {
    id: 'coverage-type',
    label: 'WA vs WA+ vs All-risk',
    intentStage: 'Comparison',
    gapLevel: 'High',
    priorityScore: 82,
    h1: 'WA, WA+ or All-risk: Which Coverage Do You Need?',
    headings: [
      { level: 2, text: 'What does WA cover?' },
      { level: 2, text: 'What does WA+ add?' },
      { level: 2, text: 'When to choose All-risk' },
      { level: 2, text: 'When to switch coverage level' },
      { level: 2, text: 'Frequently asked questions' },
      { level: 3, text: 'Coverage comparison table' },
    ],
    answerBlock:
      'WA is the legal minimum in the Netherlands and covers damage to third parties. WA+ adds theft, fire, and weather damage. All-risk covers your own vehicle too, including own-fault accidents. Choose based on your car age and value.',
    targetQuery: 'verschil WA WA+ allrisk autoverzekering',
    faq: [
      { question: 'What does All-risk cover?', answer: 'All-risk covers damage to your own vehicle, including damage caused by your own fault, plus everything WA+ covers.' },
      { question: 'Is WA+ worth it for a mid-range car?', answer: 'For cars valued between €5,000 and €15,000, WA+ usually offers the best value for money.' },
      { question: 'Can I change my coverage level?', answer: 'You can upgrade at any time. Downgrading is usually possible at annual renewal.' },
      { question: 'What is not covered by WA?', answer: 'WA does not cover damage to your own vehicle — only damage you cause to other people or their property.' },
      { question: 'At what car age should I switch to WA?', answer: 'Most Dutch drivers switch from All-risk to WA+ when their car is around 5–7 years old.' },
    ],
    hasComparisonTable: true,
    hasDisclaimer: true,
    hasCTA: true,
    seoTitle: 'WA vs WA+ vs All-risk Car Insurance | OHRA',
    metaDescription: '',  // missing — triggers metadata warning
    slug: 'autoverzekering/wa-waplus-allrisk',
    lastUpdated: '2025-01-15',
    internalLinks: [
      'https://www.ohra.nl/autoverzekering',
      'https://www.ohra.nl/autoverzekering/wa',
      'https://www.ohra.nl/autoverzekering/allrisk',
    ],
    isHowTo: false,
  },

  {
    id: 'ev-insurance',
    label: 'Electric Vehicle Insurance',
    intentStage: 'Awareness',
    gapLevel: 'High',
    priorityScore: 91,
    h1: 'Car Insurance for Electric Vehicles in the Netherlands',
    headings: [
      { level: 2, text: 'EV-specific risks' },
      { level: 2, text: 'Battery damage coverage' },
      { level: 2, text: 'Charging cable coverage' },
      { level: 2, text: 'Roadside assistance for EVs' },
      { level: 2, text: 'Frequently asked questions' },
    ],
    answerBlock:
      'Electric vehicle insurance in the Netherlands covers the same basics as standard car insurance, with additional options for battery damage and charging cable theft. All-risk is strongly recommended for new EVs due to their high value.',
    targetQuery: 'elektrische auto verzekering Nederland 2025',
    faq: [
      { question: 'Is EV battery damage covered?', answer: 'Battery coverage depends on your policy level. Check your policy document for the exact scope.' },
      { question: 'What about charging cable theft?', answer: 'Charging cable theft is typically covered under WA+ and All-risk policies. Check your policy terms.' },
      { question: 'Do I need All-risk for a new EV?', answer: 'For EVs valued over €30,000, All-risk is strongly recommended due to high repair and battery replacement costs.' },
      { question: 'Does OHRA cover EV roadside assistance?', answer: 'Roadside assistance for EVs including range emergencies is available — check your specific policy for coverage area.' },
      { question: 'Can I insure a leased EV?', answer: 'Yes. Both privately owned and leased EVs can be insured. The leasing company may require All-risk coverage.' },
    ],
    hasComparisonTable: false,  // missing — triggers warning
    hasDisclaimer: true,
    hasCTA: true,
    seoTitle: 'Electric Vehicle Car Insurance | OHRA',
    metaDescription: 'Insure your electric vehicle in the Netherlands with OHRA. Covers battery damage, charging cables, and roadside assistance.',
    slug: 'autoverzekering/elektrische-auto',
    lastUpdated: '2025-02-01',
    internalLinks: [],  // no internal links — triggers warning
    isHowTo: false,
  },

  {
    id: 'claim-handling',
    label: 'Claim Handling After Accident',
    intentStage: 'Post-purchase / Claim',
    gapLevel: 'Medium',
    priorityScore: 76,
    h1: 'What to Do After a Car Accident in the Netherlands',
    headings: [
      { level: 2, text: 'Step 1: Secure the scene' },
      { level: 2, text: 'Step 2: Complete the accident form' },
      { level: 2, text: 'Step 3: Report your claim' },
      { level: 2, text: 'Step 4: Damage assessment' },
      { level: 2, text: 'Frequently asked questions' },
    ],
    answerBlock:
      'After a car accident in the Netherlands, secure the scene, check for injuries, and complete the schadeformulier with the other driver. Then report the claim to your insurer as soon as possible with all relevant details.',
    targetQuery: 'wat te doen na auto-ongeluk Nederland',
    faq: [
      { question: 'How fast are claims handled?', answer: 'Processing times vary by claim complexity. Contact OHRA directly for current handling times.' },
      { question: 'Will my premium increase after a claim?', answer: 'Making a claim typically lowers your no-claim level, which may increase your premium at next renewal.' },
      { question: 'Can I choose my own repair garage?', answer: 'This depends on your policy. Some policies allow free choice; others require an approved partner garage.' },
      { question: 'What is the schadeformulier?', answer: 'The schadeformulier is the standard Dutch accident report form. Both drivers complete and sign it at the scene.' },
      { question: 'Do I need a police report?', answer: 'A police report is required if anyone is injured, if the other driver leaves the scene, or if there is significant road damage.' },
    ],
    hasComparisonTable: false,  // no table — expected for this content type
    hasDisclaimer: true,
    hasCTA: true,
    seoTitle: 'What to Do After a Car Accident | OHRA',
    metaDescription: 'Step-by-step guide for reporting a car accident and filing a claim in the Netherlands with OHRA.',
    slug: 'autoverzekering/schade-melden',
    lastUpdated: '2025-01-20',
    internalLinks: ['https://www.ohra.nl/autoverzekering/schade'],
    isHowTo: true,  // step-by-step process
  },

  {
    id: 'switching',
    label: 'Switching After Premium Increase',
    intentStage: 'Purchase',
    gapLevel: 'High',
    priorityScore: 88,
    h1: 'How to Switch Car Insurance in the Netherlands',
    headings: [
      { level: 2, text: 'Your right to cancel after a premium increase' },
      { level: 2, text: 'Step 1: Get a new quote' },
      { level: 2, text: 'Step 2: Start the switch' },
      { level: 2, text: 'Step 3: Transfer your no-claim discount' },
      { level: 2, text: 'Frequently asked questions' },
      { level: 3, text: 'What the 30-day cancellation right means' },
    ],
    answerBlock:
      'If your car insurer raises your premium, you have the right to cancel within 30 days under Dutch consumer law, even mid-policy year. Switching is straightforward: get a new quote, start the switch, and your no-claim discount transfers automatically via the Bonus-Malus register.',
    targetQuery: 'overstappen autoverzekering na premie verhoging',
    faq: [
      { question: 'Can I cancel my policy after a premium increase?', answer: 'Yes. Under Dutch law you can cancel within 30 days of receiving a premium increase notice, even mid-year.' },
      { question: 'What happens to my no-claim when I switch?', answer: 'Your no-claim discount transfers automatically via the Bonus-Malus register. You do not lose it by switching.' },
      { question: 'How long does switching take?', answer: 'The timeline depends on your current insurer. Contact OHRA to discuss the expected switching timeline.' },
      { question: 'Can I switch at any time?', answer: 'You can always switch at annual renewal. Mid-year switches are possible under specific conditions such as a premium increase.' },
      { question: 'Will I have a coverage gap when switching?', answer: 'No. OHRA will coordinate the start date with the end date of your current policy to avoid any gap in coverage.' },
    ],
    hasComparisonTable: false,
    hasDisclaimer: true,
    hasCTA: true,
    seoTitle: 'Switch Car Insurance After Premium Increase | OHRA',
    metaDescription: 'Learn how to switch car insurance in the Netherlands after a premium increase. Your no-claim discount transfers automatically.',
    slug: 'autoverzekering/overstappen',
    lastUpdated: '2025-03-01',
    internalLinks: [
      'https://www.ohra.nl/autoverzekering',
      'https://www.ohra.nl/autoverzekering/offerte',
      'https://www.ohra.nl/autoverzekering/no-claim',
    ],
    isHowTo: true,
  },
]
