const industries = [
  "Information and Communication",
  "Agriculture",
  "Manufacturing",
  "Healthcare",
  "Finance and Insurance",
  "Education",
  "Retail Trade",
  "Construction",
  "Real Estate",
  "Transportation and Warehousing",
  "Utilities",
  "Professional, Scientific, and Technical Services",
  "Public Administration",
  "Arts, Entertainment, and Recreation",
  "Mining, Quarrying, and Oil and Gas Extraction",
  "Wholesale Trade",
  "Accommodation and Food Services",
  "Administrative and Support Services",
  "Media and Publishing",
  "Technology and Software Development",
  "Telecommunications",
  "Energy",
  "Legal Services",
  "Pharmaceuticals",
  "Fashion and Apparel",
  "Automotive",
];

 export const bloodGroupOptions = [
    { value: "A+", text: "A+" },
    { value: "A-", text: "A-" },
    { value: "B+", text: "B+" },
    { value: "B-", text: "B-" },
    { value: "O+", text: "O+" },
    { value: "O-", text: "O-" },
    { value: "AB+", text: "AB+" },
    { value: "AB-", text: "AB-" },
  ];

export  const genotypeOptions = [
    { value: "AA", text: "AA" },
    { value: "AS", text: "AS" },
    { value: "SS", text: "SS" },
    { value: "AC", text: "AC" },
  ];

export  const eyeColorOptions = [
    { value: "brown", text: "Brown" },
    { value: "blue", text: "Blue" },
    { value: "green", text: "Green" },
    { value: "hazel", text: "Hazel" },
  ];

 export const hairColorOptions = [
    { value: "black", text: "Black" },
    { value: "brown", text: "Brown" },
    { value: "blonde", text: "Blonde" },
    { value: "red", text: "Red" },
  ];

  export const tags = [
    {value: "wanted", text: "Wanted"},
    {value: "missing", text: "missing"}
  ]
export default function getIndustries() {
  return industries;
}



export const wanted = [
  {
    name: "Very Darkman",
    note: "Sed sed risus semper, semper massa sit amet, vestibulum tortor. Quisque convallis erat eget tincidunt pellentesque.",
    tag: "wanted",
    images: [
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "Jane Doe",
    note: "Mauris ornare ex eget mollis eleifend. Mauris bibendum vehicula ex eget accumsan.",
    tag: "missing",
    images: [
      "https://images.unsplash.com/photo-1502720705749-3c28b3fb5a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "John Doe",
    note: "Maecenas semper risus nulla, in dictum eros hendrerit commodo.",
    tag: "wanted",
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "Mysterious Stranger",
    note: "Quisque convallis erat eget tincidunt pellentesque. Mauris ornare ex eget mollis eleifend.",
    tag: "missing",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "The Phantom",
    note: "Vestibulum tortor. Quisque convallis erat eget tincidunt pellentesque.",
    tag: "wanted",
    images: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1502767089025-6572583495b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "Mystic Rose",
    note: "Sed sed risus semper, semper massa sit amet, vestibulum tortor.",
    tag: "missing",
    images: [
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "The Wanderer",
    note: "Mauris bibendum vehicula ex eget accumsan. Maecenas semper risus nulla.",
    tag: "wanted",
    images: [
      "https://images.unsplash.com/photo-1550684848-d1cb6aa5a394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "Shady Character",
    note: "Mauris ornare ex eget mollis eleifend. Sed sed risus semper.",
    tag: "missing",
    images: [
      "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "The Enigma",
    note: "In dictum eros hendrerit commodo. Quisque convallis erat eget tincidunt pellentesque.",
    tag: "wanted",
    images: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
  {
    name: "Anonymous Shadow",
    note: "Mauris bibendum vehicula ex eget accumsan. Vestibulum tortor.",
    tag: "missing",
    images: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  },
];

