export interface ClauseDetail {
  id: string;
  title: string;
  category: 'Employment' | 'Sales' | 'Lease' | 'SCoTA (Coal Trading)' | 'Arbitration';
  explanation: string;
  standardLanguage: string;
  proBuyerVariation: string;
  proSellerVariation: string;
  buyerImplications: string;
  sellerImplications: string;
}

export const clauseLibrary: ClauseDetail[] = [
  {
    id: 'arb-sg',
    category: 'Arbitration',
    title: 'Singapore Arbitration (SIAC Rules)',
    explanation: 'Singapore is a premier global hub for arbitration. SIAC (Singapore International Arbitration Centre) rules are widely used in international trade, especially for Asian and Australian counterparties.',
    standardLanguage: 'Any dispute arising out of or in connection with this contract, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration in Singapore in accordance with the Arbitration Rules of the Singapore International Arbitration Centre ("SIAC Rules") for the time being in force.',
    proBuyerVariation: 'The seat of arbitration shall be Singapore. The Tribunal shall consist of three arbitrators. The language of the arbitration shall be English. Emergency Arbitrator provisions shall apply.',
    proSellerVariation: 'The seat of arbitration shall be Singapore. The Tribunal shall consist of a sole arbitrator to minimize costs. The SIAC Expedited Procedure shall apply if the amount in dispute is less than SGD 5,000,000.',
    buyerImplications: 'Provides a neutral, efficient, and highly enforceable forum. New York Convention ensures award enforceability in 160+ countries.',
    sellerImplications: 'Singapore is perceived as neutral and efficient, reducing the risk of local court interference compared to some other regional options.'
  },
  {
    id: 'arb-uae',
    category: 'Arbitration',
    title: 'UAE Arbitration (DIAC Rules)',
    explanation: 'The Dubai International Arbitration Centre (DIAC) is the primary institution in the UAE. Recent reforms have aligned DIAC rules with international best practices (UNCITRAL model).',
    standardLanguage: 'Any dispute, difference, controversy or claim arising out of or relating to this contract shall be settled by arbitration in accordance with the Dubai International Arbitration Centre (DIAC) Arbitration Rules. The seat of arbitration shall be Dubai (DIFC).',
    proBuyerVariation: 'The seat of arbitration shall be the Dubai International Financial Centre (DIFC), ensuring the application of Common Law principles and the supervision of DIFC Courts.',
    proSellerVariation: 'The seat of arbitration shall be Dubai Mainland. The arbitration shall be conducted by a sole arbitrator appointed by DIAC. The language shall be English.',
    buyerImplications: 'Choosing DIFC as the seat provides a familiar common-law framework within a civil-law country, which is often preferred by international investors.',
    sellerImplications: 'DIAC is well-established in the region and offers robust administrative support for local and regional disputes.'
  },
  {
    id: 'arb-in',
    category: 'Arbitration',
    title: 'India Arbitration (Arbitration & Conciliation Act)',
    explanation: 'Governed by the Arbitration and Conciliation Act, 1996. India has moved towards a more "pro-arbitration" stance with the 2015 and 2019 amendments, emphasizing time-bound resolutions.',
    standardLanguage: 'All disputes arising out of or in connection with this contract shall be finally settled under the Arbitration and Conciliation Act, 1996. The venue and seat of arbitration shall be [City], India.',
    proBuyerVariation: 'The arbitration shall be conducted by a panel of three arbitrators. Section 29A time limits shall be strictly observed. The High Court of [State] shall have exclusive jurisdiction over interim reliefs.',
    proSellerVariation: 'The arbitration shall be conducted by a sole arbitrator to be mutually agreed upon. Fast-track procedure under Section 29B shall be adopted.',
    buyerImplications: 'Local arbitration in India can be cost-effective but may face delays if the "Fast Track" is not strictly enforced. Ad-hoc arbitration is common.',
    sellerImplications: 'Allows for resolution in the jurisdiction where assets are often located, simplifying enforcement of domestic awards.'
  },
  {
    id: 'arb-uk',
    category: 'Arbitration',
    title: 'UK Arbitration (LCIA Rules / Arbitration Act 1996)',
    explanation: 'London is arguably the world\'s most significant arbitration seat. The Arbitration Act 1996 provides a clear, non-interventionist framework. The LCIA (London Court of International Arbitration) is the lead institution.',
    standardLanguage: 'Any dispute arising out of or in connection with this contract shall be referred to and finally resolved by arbitration under the LCIA Rules, which Rules are deemed to be incorporated by reference into this clause. The seat of arbitration shall be London, England.',
    proBuyerVariation: 'The number of arbitrators shall be three. The language of the arbitration shall be English. The law of the arbitration clause shall be English law.',
    proSellerVariation: 'The number of arbitrators shall be one. The arbitration shall be conducted in accordance with the LCIA\'s "Expedited Formation" provisions in cases of exceptional urgency.',
    buyerImplications: 'Highest degree of legal certainty and predictability. London arbitrators are globally recognized for expertise in maritime, trade, and insurance.',
    sellerImplications: 'UK courts are very supportive of arbitration and rarely set aside awards, providing finality to the dispute.'
  },
  {
    id: 'rbct-1',
    category: 'SCoTA (Coal Trading)',
    title: 'RBCT Vessel Acceptance & Vetting',
    explanation: 'Richards Bay Coal Terminal (RBCT) maintains strict technical and safety standards for vessels. All vessels must be vetted and accepted by the terminal operator prior to nomination.',
    standardLanguage: 'The Vessel nominated by the Buyer must be acceptable to the Richards Bay Coal Terminal operator. The Vessel shall comply with all current RBCT Terminal Regulations, including maximum LOA, beam, and arrival draught restrictions.',
    proBuyerVariation: 'Seller warrants that the nominated Vessel, if provided by Seller, shall be cleared by RBCT within 48 hours of nomination. Any delay in vetting exceeding 72 hours allows Buyer to nominate an alternative vessel without loss of Laycan.',
    proSellerVariation: 'Vessel acceptance is subject to RBCT terminal availability and operator discretion. Seller shall not be liable for any delays or rejection of the Vessel by the Terminal Operator provided the Vessel meets standard Capesize/Panamax specifications.',
    buyerImplications: 'Rejection of a vessel at RBCT can lead to massive demurrage and loss of slot. Buyers need strict vetting warranties.',
    sellerImplications: 'Sellers cannot control the terminal operator\'s private vetting decisions and often seek to pass that risk back to the ship owner or buyer.'
  },
  {
    id: 'rbct-2',
    category: 'SCoTA (Coal Trading)',
    title: 'RBCT Laytime & Demurrage (CQD)',
    explanation: 'Shipping at RBCT often involves specific "Customary Quick Despatch" (CQD) terms or fixed loading rates. Current regulations focus on berth productivity and terminal throughput.',
    standardLanguage: 'Laytime shall commence in accordance with SCoTA v11, but subject to RBCT Terminal Regulations regarding "Turn Time." Demurrage shall be payable at the rate specified in the Charter Party but capped at USD 35,000 per day or pro-rata.',
    proBuyerVariation: 'No Turn Time (0 hours) shall apply. Laytime to commence immediately upon Vessel arrival at RBCT pilot station, regardless of whether a berth is available (WIBON).',
    proSellerVariation: 'Standard RBCT 12-hour Turn Time applies. Laytime shall not count during periods of terminal congestion, equipment failure, or Richards Bay port closures due to high swells.',
    buyerImplications: 'Richards Bay is prone to high swells. Buyers want "WIBON" terms to start the clock even if the port is closed.',
    sellerImplications: 'Sellers want to exclude port-related delays from the laytime clock to avoid paying demurrage for things outside their control.'
  },
  {
    id: 'rbct-3',
    category: 'SCoTA (Coal Trading)',
    title: 'RBCT Quality (Final at Load)',
    explanation: 'Under latest RBCT regulations, the Quality of Coal is almost exclusively determined at the loading terminal. The sampling system at RBCT is considered one of the most accurate in the world.',
    standardLanguage: 'Quality shall be determined by mechanical sampling at RBCT. The certificate of analysis issued by the independent surveyor at the loading port shall be final and binding on both parties for the purpose of invoicing.',
    proBuyerVariation: 'Buyer may appoint a witness to oversee RBCT sampling. In case of a variance >1.5% from the mine-mouth pre-shipment analysis, a second independent analysis shall be conducted at the discharge port for reference.',
    proSellerVariation: 'The RBCT Certificate of Weight and Quality is final. No discharge port results shall be admissible. Any claims for quality must be raised within 10 days of the Bill of Lading date.',
    buyerImplications: 'While RBCT sampling is robust, buyers of specific grades (like API4) still worry about moisture gain or degradation during the long sea voyage to India or Europe.',
    sellerImplications: 'Standard practice at RBCT. Sellers rely on terminal finality to close their financing and credit lines immediately after loading.'
  },
  {
    id: 'scota-1',
    category: 'SCoTA (Coal Trading)',
    title: 'Quality Specifications (RSS)',
    explanation: 'Defines the chemical and physical properties of the coal based on Revised Standard Specifications (RSS). Typically includes Net Calorific Value (NAR), Total Moisture, and Ash content.',
    standardLanguage: 'The Quality of the Coal shall be determined in accordance with the RSS. Standard parameters: 6000 kcal/kg NAR, Max 15% Moisture, Max 14% Ash. Rejection limits apply if NAR falls below 5850 kcal/kg.',
    proBuyerVariation: 'Buyer reserves right of absolute rejection if any single parameter exceeds the "Rejection Limit" by more than 0.5%. Price adjustment shall be double the pro-rata rate for deviations.',
    proSellerVariation: 'Quality is final at loading port based on Seller\'s appointed surveyor. No rejection allowed; price adjustment (pro-rata) is the sole remedy for quality deviations.',
    buyerImplications: 'Critical to ensure the coal is compatible with the power plant. Rejection limits are the primary protection against unusable fuel.',
    sellerImplications: 'Needs to manage blending carefully. Prefers "Final at Load" terms to avoid high-seas disputes and demurrage during re-testing.'
  },
  {
    id: 'scota-2',
    category: 'SCoTA (Coal Trading)',
    title: 'Sampling and Analysis (SCoTA v11)',
    explanation: 'Outlines how the coal is tested. Under SCoTA, this usually involves a representative sample taken during loading/discharge and the role of an Umpire Laboratory.',
    standardLanguage: 'Sampling and analysis shall be performed at the Loading Port by an Independent Surveyor in accordance with ISO standards. One part of the sample shall be retained for Umpire Analysis if the parties disagree by more than the ISO reproducibility limit.',
    proBuyerVariation: 'Buyer has the right to appoint a second surveyor to witness all sampling. Analysis at Discharge Port shall be the basis for final payment.',
    proSellerVariation: 'Seller\'s surveyor analysis is final and binding unless a manifest error is proven. Umpire costs to be borne entirely by the party requesting the test.',
    buyerImplications: 'Ensures the sample isn\'t "cherry-picked." Access to witness sampling is a standard safeguard.',
    sellerImplications: 'Risk of moisture gain during transit if "Discharge Port" terms are accepted. Prefers Loading Port results to conclude the transaction.'
  },
  {
    id: 'scota-3',
    category: 'SCoTA (Coal Trading)',
    title: 'Force Majeure (Global Coal)',
    explanation: 'SCoTA uses a "closed list" or "defined event" approach to Force Majeure, which is narrower than general contract law.',
    standardLanguage: 'Neither party is liable for failure to perform caused by: Act of God, War, Blockade, Riot, or Port Closure. Notice must be given within 48 hours of the event occurring.',
    proBuyerVariation: 'Includes "Upstream Failures" and "Power Grid Failure" as Force Majeure events, allowing Buyer to cancel without penalty if delivery is delayed > 14 days.',
    proSellerVariation: 'Specifically excludes "Lack of Market," "Strikes by Seller\'s Personnel," or "Mine Failure." Seller must provide alternative coal if the primary mine is unavailable.',
    buyerImplications: 'Buyers want broad protection if their plant shuts down. However, SCoTA usually protects the sanctity of the trade.',
    sellerImplications: 'Avoids "speculative defaults" where a party claims FM just because the market price changed (Price FM is strictly prohibited).'
  },
  {
    id: 'scota-4',
    category: 'SCoTA (Coal Trading)',
    title: 'Weight Determination (Draught Survey)',
    explanation: 'Method for calculating the tonnage delivered. In maritime coal trades, this is usually via vessel draught survey.',
    standardLanguage: 'The weight of the Coal shall be determined by a Draught Survey at the Loading Port conducted by an Independent Surveyor. The result shall be final and binding for invoicing.',
    proBuyerVariation: 'Weight shall be determined by certified Belt Scales at the Discharge Port. Any discrepancy >0.5% compared to Draught Survey triggers a joint re-survey.',
    proSellerVariation: 'Weight is final as per Shore Scales at the Loading Port. Any Draught Survey is for reference only.',
    buyerImplications: 'Draught surveys can be manipulated (vessel ballast/fuel). Discharge weights are more accurate but carry transit loss risks.',
    sellerImplications: 'Prefers Loading weights to ensure they are paid for every ton that left the mine.'
  },
  {
    id: 'sale-1',
    category: 'Sales',
    title: 'Limitation of Liability',
    explanation: 'Caps the amount one party has to pay the other in damages if something goes wrong under the contract.',
    standardLanguage: 'Neither party shall be liable for any indirect or consequential damages. Total liability is capped at the total fees paid under this agreement.',
    proBuyerVariation: 'Seller liability for breach of warranty or negligence is uncapped. Buyer liability is capped at 10% of contract value.',
    proSellerVariation: 'Seller total liability is capped at $1,000 or the price of the specific defective unit, whichever is lower.',
    buyerImplications: 'Reduces the ability to recover full losses if the product causes significant business disruption.',
    sellerImplications: 'Essential for risk management. Prevents a single mistake from bankrupting the business.'
  }
];