/* ISEO — real catalogue data (from the existing site)
   Prices in DZD. Images: real photos (Unsplash) with graceful fallback.
   Replace `img` values with your own photos in assets/images/ when ready. */

window.ISEO_CATS = [
  { id: "cyl",    name: "Cylindres & serrures", count: 4, icon: "cylinder" },
  { id: "pad",    name: "Cadenas",              count: 3, icon: "padlock"  },
  { id: "safe",   name: "Coffres-forts",        count: 2, icon: "safe"     },
  { id: "access", name: "Contrôle d’accès",     count: 3, icon: "access"   },
];

// Helper Pexels (vraies photos, URL construite depuis un ID vérifié)
const px = (id, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

window.ISEO_PRODUCTS = [
  { id:"p1",  cat:"cyl",   ref:"CYL-R6-3030", price:8900,  tag:"best",
    name:"Cylindre européen R6",
    desc:"Double entrée à profil européen, 5 goupilles, 3 clés. Anti-crochetage de base pour portes d’appartement.",
    img: px(277581) },
  { id:"p2",  cat:"cyl",   ref:"CYL-R9-3545", price:14500, tag:"secure",
    name:"Cylindre haute sécurité R9",
    desc:"Anti-perçage, anti-bumping, anti-crochetage. Carte de propriété pour reproduction de clés contrôlée.",
    img: px(3276079) },
  { id:"p3",  cat:"cyl",   ref:"SER-3PTS-A2P", price:22000, tag:"",
    name:"Serrure 3 points encastrée",
    desc:"Verrouillage en trois points pour porte d’entrée. Pênes renforcés, gâches acier incluses.",
    img: px(164425) },
  { id:"p4",  cat:"cyl",   ref:"VER-BTN-SEC", price:4800, tag:"",
    name:"Verrou de sécurité à bouton",
    desc:"Verrou en applique à cylindre, bouton intérieur. Pose simple en complément de serrure.",
    img: px(373550) },
  { id:"p5",  cat:"pad",   ref:"CAD-BLD-50", price:3200, tag:"best",
    name:"Cadenas blindé 50 mm",
    desc:"Corps en acier cémenté, anse protégée. Idéal portails, dépôts et rideaux métalliques.",
    img: px(4291) },
  { id:"p6",  cat:"pad",   ref:"CAD-LTN-40", price:1450, tag:"",
    name:"Cadenas laiton 40 mm",
    desc:"Laiton massif résistant à la corrosion, 3 clés fournies. Usage courant.",
    img: px(164425) },
  { id:"p7",  cat:"pad",   ref:"CAD-COMB-4D", price:1900, tag:"",
    name:"Cadenas à combinaison",
    desc:"Ouverture par code 4 chiffres reprogrammable. Sans clé, anti-perte.",
    img: px(1011848) },
  { id:"p8",  cat:"safe",  ref:"CFF-IGN-30", price:38000, tag:"secure",
    name:"Coffre-fort ignifuge 30 L",
    desc:"Protection feu 30 min, serrure à clé + code. Pour documents, espèces et bijoux.",
    img: px(4291) },
  { id:"p9",  cat:"safe",  ref:"CFF-COD-15", price:19900, tag:"best",
    name:"Coffre-fort à code 15 L",
    desc:"Pavé électronique, ancrage mural et sol. Compact pour domicile ou bureau.",
    img: px(277581) },
  { id:"p10", cat:"access", ref:"INT-VID-7", price:27500, tag:"new",
    name:"Interphone vidéo 7\"",
    desc:"Écran couleur 7 pouces, vision nocturne, gâche électrique compatible. Filaire.",
    img: px(2259221) },
  { id:"p11", cat:"access", ref:"BIO-LCK-PRO", price:45000, tag:"new",
    name:"Serrure biométrique connectée",
    desc:"Empreinte, code, badge et application. Historique des accès et alertes en temps réel.",
    img: px(3276079) },
  { id:"p12", cat:"access", ref:"RFID-X5", price:2500, tag:"",
    name:"Badges RFID (lot de 5)",
    desc:"Badges de proximité compatibles avec nos systèmes de contrôle d’accès.",
    img: px(30932198) },
];

window.ISEO_SERVICES = [
  { n:"01", icon:"install", name:"Installation de serrures & cylindres", desc:"Pose propre et ajustée de serrures multipoints et cylindres haute sécurité." },
  { n:"02", icon:"bolt",    name:"Dépannage & ouverture 24/7",           desc:"Porte claquée ou serrure bloquée ? Intervention rapide sans dégâts inutiles." },
  { n:"03", icon:"safe",    name:"Pose de coffres-forts",                desc:"Scellement et ancrage sécurisés, conseil sur l’emplacement et la classe." },
  { n:"04", icon:"access",  name:"Contrôle d’accès & interphonie",       desc:"Interphones vidéo, serrures connectées et gestion de badges, particuliers & entreprises." },
  { n:"05", icon:"shield",  name:"Mise en sécurité après effraction",    desc:"Diagnostic, remplacement et renforcement immédiat de vos points de fermeture." },
  { n:"06", icon:"key",     name:"Reproduction de clés sécurisées",      desc:"Double de clés brevetées sur présentation de la carte de propriété." },
];

window.ISEO_STEPS = [
  { n:"1", t:"Vous nous contactez", d:"Par téléphone ou formulaire, décrivez votre besoin." },
  { n:"2", t:"Diagnostic & devis",  d:"Conseil sur place ou à distance, devis clair sans surprise." },
  { n:"3", t:"Installation",        d:"Pose par un technicien certifié, dans les règles de l’art." },
  { n:"4", t:"Garantie & suivi",    d:"Garantie pièces et main-d’œuvre, SAV réactif." },
];

window.fmtDA = n => new Intl.NumberFormat('fr-DZ').format(n) + ' DA';
