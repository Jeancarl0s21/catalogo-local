export type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  active: boolean;
  highlight?: boolean;
  imageClass: string;
  bottleClass: string;
};

export const store = {
  name: "Aroma da Esquina",
  segment: "Loja demo de perfumes",
  slug: "demo",
  whatsapp: "558196151591",
  address: "Centro, São Paulo",
  description:
    "Uma vitrine demo para mostrar como pequenos comércios locais podem apresentar produtos e vender pelo WhatsApp.",
};

export const products: Product[] = [
  {
    id: 1,
    name: "Aurora Floral Eau de Parfum 100ml",
    category: "Femininos",
    price: "R$ 149,90",
    description: "Floral delicado com toque de pera, jasmim e fundo levemente adocicado.",
    active: true,
    highlight: true,
    imageClass: "bg-[linear-gradient(135deg,#fff1f2,#fbcfe8,#fef3c7)]",
    bottleClass: "bg-rose-200 border-rose-300",
  },
  {
    id: 2,
    name: "Noir Amadeirado 75ml",
    category: "Masculinos",
    price: "R$ 139,90",
    description: "Perfume intenso com notas de cedro, especiarias e âmbar.",
    active: true,
    highlight: true,
    imageClass: "bg-[linear-gradient(135deg,#e7e5e4,#78716c,#1c1917)]",
    bottleClass: "bg-stone-700 border-stone-500",
  },
  {
    id: 3,
    name: "Cítrico Fresh Deo Colônia 100ml",
    category: "Unissex",
    price: "R$ 89,90",
    description: "Fragrância fresca para o dia a dia, com bergamota e folhas verdes.",
    active: true,
    imageClass: "bg-[linear-gradient(135deg,#ecfccb,#bbf7d0,#bae6fd)]",
    bottleClass: "bg-lime-200 border-lime-300",
  },
  {
    id: 4,
    name: "Velvet Vanilla 50ml",
    category: "Femininos",
    price: "R$ 119,90",
    description: "Baunilha cremosa com notas florais e fundo confortável.",
    active: true,
    imageClass: "bg-[linear-gradient(135deg,#fef3c7,#fed7aa,#fde68a)]",
    bottleClass: "bg-amber-200 border-amber-300",
  },
  {
    id: 5,
    name: "Kit Presente Essencial",
    category: "Kits",
    price: "R$ 189,90",
    description: "Perfume, hidratante e embalagem para presente em um combo pronto.",
    active: true,
    highlight: true,
    imageClass: "bg-[linear-gradient(135deg,#ccfbf1,#f0fdfa,#d9f99d)]",
    bottleClass: "bg-teal-200 border-teal-300",
  },
  {
    id: 6,
    name: "Body Splash Flor de Chá 200ml",
    category: "Cuidados",
    price: "R$ 54,90",
    description: "Leve, refrescante e ideal para reaplicar ao longo do dia.",
    active: true,
    imageClass: "bg-[linear-gradient(135deg,#f5f3ff,#ddd6fe,#fce7f3)]",
    bottleClass: "bg-violet-200 border-violet-300",
  },
  {
    id: 7,
    name: "Oud Intenso Eau de Parfum 50ml",
    category: "Premium",
    price: "R$ 219,90",
    description: "Perfume marcante com oud, couro e madeiras nobres.",
    active: true,
    imageClass: "bg-[linear-gradient(135deg,#fef08a,#a16207,#292524)]",
    bottleClass: "bg-yellow-700 border-yellow-500",
  },
  {
    id: 8,
    name: "Miniaturas Descoberta",
    category: "Kits",
    price: "R$ 79,90",
    description: "Seleção com quatro mini perfumes para conhecer novas fragrâncias.",
    active: true,
    imageClass: "bg-[linear-gradient(135deg,#e0f2fe,#fae8ff,#ffe4e6)]",
    bottleClass: "bg-sky-200 border-sky-300",
  },
  {
    id: 9,
    name: "Sport Energy 100ml",
    category: "Masculinos",
    price: "R$ 99,90",
    description: "Aromático fresco com lavanda, limão siciliano e musk.",
    active: false,
    imageClass: "bg-[linear-gradient(135deg,#dbeafe,#93c5fd,#1d4ed8)]",
    bottleClass: "bg-blue-300 border-blue-400",
  },
];

export const categories = [
  "Todos",
  ...Array.from(new Set(products.map((product) => product.category))),
];

export function whatsappUrl(productName: string) {
  const message = `Olá! Tenho interesse no produto: ${productName}. Ainda está disponível?`;
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}
