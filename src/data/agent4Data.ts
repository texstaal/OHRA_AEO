import type { DraftInput } from '@/types/agent4'

// Each draft contains intentionally risky claims so Agent 4 can detect them during the demo.
// Risky phrases are marked with inline comments explaining the intended rule trigger.
export const draftInputs: DraftInput[] = [
  {
    id: 'young-drivers',
    label: 'Young Drivers',
    intentStage: 'Consideration',
    gapLevel: 'High',
    priorityScore: 87,
    text: `Best Car Insurance for Young Drivers in the Netherlands (2025)

Finding car insurance as a young driver is challenging. OHRA is the cheapest option for young drivers who need their first policy. We offer competitive coverage for drivers aged 18–25.

Coverage options include WA (third-party only), WA+ (adds theft and weather damage), and All-risk (covers own-fault damage). Most young drivers start with WA or WA+ for an older car.

[PLACEHOLDER: add current OHRA premium examples for age bracket 18–25 — requires product team sign-off]

How to reduce your premium: increase your voluntary excess, choose a lower-powered car, and compare quotes annually. Building no-claim history from year one is essential.

OHRA offers the best no-claim discount structure in the Dutch market, helping young drivers lower their costs every claim-free year.

FAQ:
Q: Why is my premium high as a young driver?
A: Insurers apply an age surcharge because under-25 drivers statistically have more accidents.

Q: Can I reduce my premium as a young driver?
A: Yes. Drive carefully, increase your excess, and compare your options annually.

Q: Will I lose my no-claim when I switch?
A: No. No-claim transfers automatically via the Dutch Bonus-Malus register.

Ready to compare? [PLACEHOLDER: link to OHRA quote page]`,

    missingEvidence: [
      'Current OHRA premium examples for age bracket 18–25',
      'Verification of no-claim discount structure vs. market competitors',
      'Policy document confirmation of coverage level definitions',
      'Legal approval for age-related pricing statements',
    ],
    brandToneNotes: [
      'Opening tone is appropriately informational — good starting point.',
      '"OHRA is the cheapest" is too assertive — risks coming across as a sales pitch rather than a trusted guide.',
      'FAQ section is well-structured and neutral in tone.',
      'CTA placeholder is sensible — ensure the final CTA is action-oriented without being pushy.',
    ],
  },

  {
    id: 'coverage-type',
    label: 'WA vs WA+ vs All-risk',
    intentStage: 'Comparison',
    gapLevel: 'High',
    priorityScore: 82,
    text: `WA, WA+ or All-risk: Which Coverage Do You Need? (Netherlands 2025)

Choosing your coverage level is one of the most important car insurance decisions you will make. OHRA guarantees the lowest premium for each coverage level available in the Dutch market.

WA is the legal minimum — it covers damage you cause to others but not your own vehicle. WA+ adds coverage for theft, fire, weather, and glass breakage. All damage is fully covered with our All-risk policy, making it suitable for new or high-value vehicles.

Comparison table:
WA: third-party only | Cars older than 7 years | Lowest cost
WA+: adds theft, weather | Cars 4–7 years old | Mid-range cost
All-risk: full protection | Cars under 4 years or financed | Highest cost

When to switch: most Dutch drivers switch from All-risk to WA+ when their car reaches 5–7 years old and its value has dropped sufficiently.

FAQ:
Q: What does All-risk cover?
A: All damage is fully covered, including damage caused by your own fault.

Q: Is WA+ worth it for a mid-range car?
A: For cars valued between €5,000 and €15,000, WA+ usually offers the best value.

Q: Can I change my coverage level?
A: You can upgrade at any time. Downgrading is usually possible at annual renewal.`,

    missingEvidence: [
      'Verified current OHRA premiums for each coverage level (WA, WA+, All-risk)',
      'Specific exclusions list for All-risk policy (required to avoid "all damage" claims)',
      'Market comparison data to support the "lowest premium" claim',
      'Legal review of coverage descriptions to ensure accuracy',
    ],
    brandToneNotes: [
      'Comparison table structure is clear and well-organized — good for AI extraction.',
      '"Guarantees the lowest premium" is an aggressive claim that undermines credibility if not supported.',
      '"All damage is fully covered" is misleading and creates unrealistic expectations.',
      'Overall tone is informational but undermined by overreaching coverage statements.',
    ],
  },

  {
    id: 'ev-insurance',
    label: 'Electric Vehicle Insurance',
    intentStage: 'Awareness',
    gapLevel: 'High',
    priorityScore: 91,
    text: `Car Insurance for Electric Vehicles in the Netherlands (2025)

Electric vehicles are growing fast across the Netherlands. EV battery damage is always included in our OHRA standard EV policy, making us the best choice for EV owners who want complete peace of mind.

EV-specific risks: battery damage, charging cable theft, roadside assistance for charging emergencies, and high replacement costs. All-risk is strongly recommended for new EVs due to their high value.

[PLACEHOLDER: confirm exact battery coverage scope with OHRA policy team before publishing]

Charging cable coverage: Charging cables are always covered under our policy. No exceptions.

Roadside assistance: OHRA provides 100% coverage for all EV-related roadside incidents in the Netherlands and all European countries.

[PLACEHOLDER: verify roadside assistance EV terms — do not publish without product confirmation]

FAQ:
Q: Is EV battery damage covered?
A: EV battery damage is always included in OHRA's standard EV insurance policy.

Q: What about charging cable theft?
A: Always covered. No exceptions apply.

Q: Do I need All-risk for a new EV?
A: For EVs valued over €30,000, All-risk is strongly recommended due to high repair and battery replacement costs.`,

    missingEvidence: [
      'Exact OHRA policy wording on EV battery coverage (physical damage vs. degradation)',
      'Confirmation of charging cable coverage from OHRA policy documents',
      'Roadside assistance EV-specific terms (including range emergency coverage)',
      'List of EU countries covered by OHRA roadside assistance',
      'Legal review of absolute coverage claims ("always included", "no exceptions")',
    ],
    brandToneNotes: [
      'This draft contains the highest density of absolute claims — "always", "no exceptions", "100%" — which significantly increase legal risk.',
      '"Best choice for EV owners" is a competitive superlative that requires market research to support.',
      'The FAQ reinforces risky claims rather than adding nuance — needs a complete rewrite of FAQ answers.',
      'Two unfilled placeholders indicate the draft is not ready for marketing review.',
    ],
  },

  {
    id: 'claim-handling',
    label: 'Claim Handling After Accident',
    intentStage: 'Post-purchase / Claim',
    gapLevel: 'Medium',
    priorityScore: 76,
    text: `What to Do After a Car Accident in the Netherlands (2025)

Being involved in an accident is stressful. Claims are always handled within 24 hours at OHRA — we have the fastest claims processing in the Dutch market. Never worry about delayed payments when you are insured with OHRA.

Step 1: Secure the scene and check for injuries. Call 112 if needed.
Step 2: Complete the schadeformulier with the other driver.
Step 3: Report your claim to OHRA. [PLACEHOLDER: OHRA claims contact number and portal link]
Step 4: Our team will assess the damage and guarantee fair compensation for all verified claims.

Average resolution: OHRA processes all straightforward claims within 24 hours and guarantees the fastest resolution in the Netherlands.

No-claim impact: Making a claim typically lowers your no-claim level. We always minimize the impact on your premium — your satisfaction is guaranteed.

FAQ:
Q: How fast are claims handled?
A: Claims are always handled within 24 hours at OHRA.

Q: Will my premium increase after a claim?
A: We work hard to minimize premium impact after a claim.

Q: Can I choose my own repair garage?
A: Check your specific policy — some policies allow free choice, others require an approved partner.`,

    missingEvidence: [
      'Verified average OHRA claims handling time (data from OHRA claims department)',
      'Benchmarked comparison data to support "fastest claims processing in the Dutch market"',
      'Claims contact number and portal URL to replace placeholder',
      'Definition of "guaranteed fair compensation" and the appeals process',
      'Legal review of time commitment statements',
    ],
    brandToneNotes: [
      '"Never worry about delayed payments" is dismissive of a legitimate concern — better to be factual about process.',
      '"Fastest claims processing in the Dutch market" is a strong competitive claim that requires continuous benchmarking to maintain.',
      'FAQ answers are problematic — they repeat the risky claims rather than providing factual, measured responses.',
      'The emotional language ("satisfaction is guaranteed") is appropriate in some contexts but risky in insurance without precise definition.',
    ],
  },

  {
    id: 'switching',
    label: 'Switching After Premium Increase',
    intentStage: 'Purchase',
    gapLevel: 'High',
    priorityScore: 88,
    text: `How to Switch Car Insurance in the Netherlands (2025)

Switching your car insurance is quick and easy. You can cancel your policy at any time without conditions when switching to OHRA. Our team guarantees the switch is completed within 1 business day.

Premium increase rights: Under Dutch consumer law, if your insurer raises your premium you have the right to cancel within 30 days of the notice — even mid-policy year.

Step 1: Get a quote from OHRA and compare your current premium.
Step 2: Contact OHRA to start the switch — always guaranteed within 24 hours.
Step 3: OHRA handles the cancellation process with your old insurer on your behalf.
[PLACEHOLDER: confirm whether OHRA offers a full switching service — requires product team sign-off]

No-claim transfer: Your no-claim discount transfers automatically via the Bonus-Malus register. OHRA is always the best option after a premium increase.

FAQ:
Q: Can I cancel my policy at any time?
A: You can cancel your policy at any time without conditions when switching to OHRA.

Q: What happens to my no-claim when I switch?
A: It transfers automatically — guaranteed.

Q: How fast is the switch?
A: OHRA guarantees your switch within 1 business day.

[PLACEHOLDER: link to OHRA switching page]`,

    missingEvidence: [
      'Confirmation of whether OHRA manages the cancellation process for switching customers',
      'OHRA\'s actual switching timeline (1 business day claim requires verification)',
      'Legal basis reference for the 30-day cancellation right (Burgerlijk Wetboek article)',
      'OHRA switching page URL to replace placeholders',
      'Legal review of guarantee language in switching context',
    ],
    brandToneNotes: [
      '"Quick and easy" is a good starting tone — appropriate for a switching guide.',
      '"At any time without conditions" is factually incorrect and the most legally problematic phrase in this draft.',
      '"Always the best option" after premium increase is an unsupported absolute claim.',
      'The FAQ section repeats the risky claims — needs rewriting to be factual and qualified.',
      'Step-by-step format is appropriate and well-suited for AI extraction — a structural strength of this draft.',
    ],
  },
]
