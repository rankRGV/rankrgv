// Content for the free Google Business Profile setup guide (EN + ES).
// Every rule here comes from Google's own Business Profile help pages, listed in `sources`
// (checked 2026-11-23). If Google changes a rule, update both languages and the checked date.
// Pages: src/pages/google-business-profile-setup.astro and src/pages/es/crear-perfil-de-google.astro.

export interface GuideStep {
  title: string;
  body: string[];
  /** A button that opens the Google page this step happens on (new tab, so the guide stays open). */
  action?: { label: string; href: string };
  bullets?: string[];
  /** An either/or choice. `goTo` links to another step on this page. */
  options?: { title: string; text?: string; bullets?: string[]; goTo?: { label: string; step: number } }[];
  /** A right way and a wrong way, side by side. */
  example?: { good: { label: string; text: string }; bad: { label: string; text: string } };
  /** Named items, each with its own rules (the verification methods). */
  methods?: { name: string; tag?: string; text: string; points?: string[]; after?: string }[];
  note?: string;
  /** Put the phone number after the note. */
  noteCall?: boolean;
  image?: { src: string; alt: string; caption: string; width: number; height: number };
}

export interface GuideContent {
  lang: 'en' | 'es';
  path: string;
  altPath: string;
  altLabel: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  facts: string[];
  helpLine: string;
  readyHeading: string;
  readyIntro: string;
  ready: { label: string; detail?: string }[];
  stepsHeading: string;
  jumpLabel: string;
  newTabLabel: string;
  steps: GuideStep[];
  mistakesHeading: string;
  mistakes: string[];
  faqHeading: string;
  faqs: { question: string; answer: string }[];
  sourcesHeading: string;
  sourcesIntro: string;
  sourcesChecked: string;
  sources: { label: string; href: string }[];
  ctaHeadline: string;
  ctaSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  moreLink: { label: string; href: string };
}

const googleSources = {
  add: 'https://support.google.com/business/answer/2911778',
  verify: 'https://support.google.com/business/answer/7107242',
  video: 'https://support.google.com/business/answer/14271705',
  guidelines: 'https://support.google.com/business/answer/3038177',
  serviceArea: 'https://support.google.com/business/answer/9157481',
  category: 'https://support.google.com/business/answer/7249669',
};

const googlePages = {
  maps: 'https://www.google.com/maps',
  add: 'https://business.google.com/add',
};

const screenshot = { src: '/images/guides/gbp-find-or-add-business.webp', width: 613, height: 320 };

export const gbpSetupGuide: Record<'en' | 'es', GuideContent> = {
  en: {
    lang: 'en',
    path: '/google-business-profile-setup/',
    altPath: '/es/crear-perfil-de-google/',
    altLabel: 'Ver en español',
    title: 'How to Set Up a Google Business Profile, Step by Step | RankRGV',
    description:
      "No Google listing yet? A free step by step guide to creating and verifying your Google Business Profile, based on Google's own rules. For Rio Grande Valley businesses.",
    h1: 'Set up your Google Business Profile, step by step',
    intro:
      "If your business doesn't show up on Google Maps, it most likely has no Google Business Profile yet, or the profile was never verified. Setting one up is free and you can do it yourself. Every step below follows Google's own help pages, so you know what Google will ask before it asks.",
    facts: ['Free', '8 steps', 'Google review: up to 5 business days in most cases'],
    helpLine: 'Rather do it together? Call or text',
    readyHeading: 'Have these ready before you start',
    readyIntro: 'Ten minutes of prep saves you a stuck verification later. Check each one off as you find it.',
    ready: [
      {
        label: "A Google account you'll keep for the long run.",
        detail: "Use one that belongs to the business, not an employee's personal account, so you don't lose your listing when someone leaves.",
      },
      { label: 'Your exact business name.', detail: 'As it appears on your sign, invoices and paperwork.' },
      {
        label: 'A phone that can take calls or texts.',
        detail: "Google's code can't get through an automated phone menu.",
      },
      {
        label: 'Your mailing address, even if customers never come there.',
        detail: 'Google may mail you a code.',
      },
      { label: 'If you go to your customers: the cities or ZIP codes you serve.', detail: 'Up to 20 of them.' },
      { label: 'Your business hours.' },
      {
        label: 'For a video check: a smartphone and a document in the business name.',
        detail: 'Like a business permit, an invoice or a utility bill.',
      },
    ],
    stepsHeading: 'The steps',
    jumpLabel: 'Jump to a step',
    newTabLabel: 'opens in a new tab',
    steps: [
      {
        title: 'Check if Google already has a listing for you',
        body: [
          'Google sometimes creates listings on its own from public information. Search Google Maps for your business name and your city before you make a new one.',
        ],
        action: { label: 'Search Google Maps', href: googlePages.maps },
        options: [
          {
            title: 'You found it',
            text: 'Open it, select "Claim this business," then "Manage now."',
            goTo: { label: 'Skip to step 7 to verify it', step: 7 },
          },
          {
            title: 'Nothing comes up',
            goTo: { label: 'Go to step 2', step: 2 },
          },
        ],
        note: "Found your business but someone else already manages it? Don't make a second listing. Call us and we'll help you sort out who has access.",
        noteCall: true,
      },
      {
        title: 'Start your profile',
        body: [
          'Go to business.google.com/add and sign in with the Google account you picked. Google first asks you to type your business name, so it can check for a listing one more time. If yours does not come up, select "Add your business to Google" and follow the prompts.',
        ],
        action: { label: 'Open business.google.com/add', href: googlePages.add },
        image: {
          ...screenshot,
          alt: 'Google Business Profile start screen with a "Type your business name" search box and an "Add your business to Google" link',
          caption: 'The first screen at business.google.com/add (November 2026).',
        },
      },
      {
        title: 'Type your real business name',
        body: [
          'Use the name customers see on your sign, invoices and website. Nothing extra. Google says adding unnecessary information to the name can get the profile suspended.',
        ],
        bullets: [
          'No city or area names ("near Downtown McAllen").',
          'No services, slogans, hours, phone numbers or web addresses.',
          'No words in ALL CAPS.',
          'LLC or Inc. only if it really appears on your sign or invoices.',
        ],
        example: {
          good: { label: 'Good', text: 'Garza Plumbing' },
          bad: { label: 'Gets you in trouble', text: 'Garza Plumbing McAllen 24 Hr Drain Cleaning' },
        },
      },
      {
        title: 'Pick your category',
        body: [
          'Choose the category that finishes the sentence "This business is a ___." Pick the most specific one that fits. If yours is not on the list, choose a broader one. You cannot create your own.',
          'Use as few categories as you can. Services you offer go in the services section later, not in categories.',
        ],
      },
      {
        title: 'Address or service area',
        body: [],
        options: [
          {
            title: 'Customers come to your place',
            text: "Add the address. Only do this if there's a permanent sign and staff there during your listed hours.",
          },
          {
            title: 'You go to the customer',
            text: "Home services, mobile work, security, cleaning. Leave the address off the public profile and list the areas you serve instead. Working from home is fine. Google's own example is a plumber who works from home.",
            bullets: [
              'Up to 20 service areas, by city or ZIP code.',
              'No radius. Google does not allow it.',
              'Keep the areas within about 2 hours of driving from your base.',
            ],
          },
        ],
      },
      {
        title: 'Add your phone and website',
        body: ['Use the number you actually answer. No website yet? You can leave it blank and add one later.'],
      },
      {
        title: 'Verify your business',
        body: [
          "Google picks the verification method for you, based on your type of business, public information, your region and your hours. You can't change it, and Google may ask for more than one. The options are a text or call, an email, a live video call, a recorded video, or a postcard.",
        ],
        methods: [
          {
            name: 'Recorded video',
            tag: 'Google recommends it when offered',
            text: 'At least 30 seconds, one continuous take, no edits, recorded and uploaded from your phone through the profile. Show:',
            points: [
              'Where you are: street signs, your address number, landmarks.',
              'That the business is real: equipment, tools, branded shirts or a work vehicle.',
              'That you run it: a permit, invoice or utility bill in the business name.',
            ],
            after: "Do not show other people's faces or private information.",
          },
          {
            name: 'Live video call',
            text: 'Only during your listed business hours. Have the same proof ready.',
          },
          {
            name: 'Text or call',
            text: 'You have to answer the business phone yourself. A phone menu system will not get the code.',
          },
          {
            name: 'Postcard',
            text: "It arrives within 14 days and the code expires after 30. While you wait, don't edit your name, address or category, and don't ask for a second code.",
          },
        ],
        note: "Google says reviews take up to 5 business days in most cases. You'll get an email when it's done.",
      },
      {
        title: 'Finish your profile once it is verified',
        body: [
          'Add or fix your service areas (Edit profile, then Location, then Service area), your hours, real photos and your services. Edits can take up to 48 hours to show.',
          'Changing your name, address or category later can send you back through verification, so get them right now.',
        ],
      },
    ],
    mistakesHeading: 'Mistakes that stall a new profile',
    mistakes: [
      'Making a second listing when Google already had one for you.',
      'Adding your city or services to the business name.',
      "Showing a street address where customers can't actually walk in.",
      'Editing the name, address or category while a verification is pending.',
      "Setting it up under an employee's personal Google account.",
    ],
    faqHeading: 'Google Business Profile setup questions',
    faqs: [
      {
        question: 'Does a Google Business Profile cost anything?',
        answer: 'No. Creating and verifying a Google Business Profile is free.',
      },
      {
        question: 'How long until my business shows up?',
        answer:
          "Google says verification reviews take up to 5 business days in most cases, and a postcard can take up to 14 days to arrive. Being on the map is not the same as showing up first. Where you rank depends on how well you match the search, how close you are and how well known your business is.",
      },
      {
        question: "I work from home or go to my customers. Can I still have a profile?",
        answer:
          'Yes. Hide your address and list your service area instead, up to 20 cities or ZIP codes. Google allows this for businesses that serve customers at their location.',
      },
      {
        question: 'My video verification got rejected. What now?',
        answer:
          'Record a new one in a single take. Make sure it shows where you are, the tools or equipment of your trade, and a document with your business name on it. Our verification guide covers the common reasons videos get turned down.',
      },
      {
        question: 'Can RankRGV set it up for me?',
        answer:
          "We can walk you through it on a call. The profile should stay in your own Google account, so you always own it. If you want help keeping it active once it's live, that's what our Increase Call Plan does.",
      },
    ],
    sourcesHeading: "Where these rules come from",
    sourcesIntro: "Every rule in this guide comes from Google's Business Profile help center:",
    sourcesChecked: 'Checked November 23, 2026. Google updates these pages from time to time.',
    sources: [
      { label: 'Add or claim your Business Profile', href: googleSources.add },
      { label: 'Verify your business on Google', href: googleSources.verify },
      { label: 'Verify your business with a video recording', href: googleSources.video },
      { label: 'Guidelines for representing your business on Google', href: googleSources.guidelines },
      { label: 'Manage your service area', href: googleSources.serviceArea },
      { label: 'Manage your business category', href: googleSources.category },
    ],
    ctaHeadline: 'Profile live? See how it stacks up.',
    ctaSub: 'Run the free check. It compares your listing with the businesses next to you on the map.',
    ctaPrimary: 'Check my listing free',
    ctaSecondary: 'Call',
    breadcrumbHome: 'Home',
    breadcrumbLabel: 'Google Business Profile setup',
    moreLink: { label: 'More on verification problems: How to verify your Google Business Profile', href: '/blog/verify-google-business-profile-2026/' },
  },
  es: {
    lang: 'es',
    path: '/es/crear-perfil-de-google/',
    altPath: '/google-business-profile-setup/',
    altLabel: 'View in English',
    title: 'Cómo Crear su Perfil de Negocio en Google, Paso a Paso | RankRGV',
    description:
      'Si su negocio no aparece en Google Maps, esta guía gratis le explica cómo crear y verificar su Perfil de Negocio en Google, según las reglas de Google. Para negocios del Valle.',
    h1: 'Cree su Perfil de Negocio en Google, paso a paso',
    intro:
      'Si su negocio no aparece en Google Maps, lo más probable es que todavía no tenga un Perfil de Negocio en Google, o que nunca se verificó. Crearlo es gratis y lo puede hacer usted mismo. Cada paso de esta guía sigue las páginas de ayuda de Google, para que sepa qué le va a pedir Google antes de que se lo pida.',
    facts: ['Gratis', '8 pasos', 'Revisión de Google: hasta 5 días hábiles en la mayoría de los casos'],
    helpLine: '¿Prefiere hacerlo con nosotros? Llame o mande texto al',
    readyHeading: 'Tenga esto listo antes de empezar',
    readyIntro:
      'Diez minutos de preparación le ahorran una verificación atorada después. Marque cada cosa cuando la tenga.',
    ready: [
      {
        label: 'Una cuenta de Google que va a conservar.',
        detail: 'Use una que sea del negocio, no la cuenta personal de un empleado, para no perder su perfil si esa persona se va.',
      },
      {
        label: 'El nombre exacto de su negocio.',
        detail: 'Tal como aparece en su letrero, sus facturas y sus papeles.',
      },
      {
        label: 'Un teléfono que reciba llamadas o textos.',
        detail: 'El código de Google no pasa por un menú automático de opciones.',
      },
      {
        label: 'Su dirección postal, aunque sus clientes nunca vayan ahí.',
        detail: 'Google le puede mandar un código por correo.',
      },
      {
        label: 'Si usted va con sus clientes: las ciudades o códigos postales donde trabaja.',
        detail: 'Hasta 20.',
      },
      { label: 'Su horario.' },
      {
        label: 'Para la verificación por video: un celular y un documento a nombre del negocio.',
        detail: 'Como un permiso, una factura o un recibo de luz o agua.',
      },
    ],
    stepsHeading: 'Los pasos',
    jumpLabel: 'Ir a un paso',
    newTabLabel: 'se abre en otra pestaña',
    steps: [
      {
        title: 'Revise si Google ya tiene su negocio',
        body: [
          'A veces Google crea perfiles por su cuenta con información pública. Antes de crear uno nuevo, busque en Google Maps el nombre de su negocio y su ciudad.',
        ],
        action: { label: 'Buscar en Google Maps', href: googlePages.maps },
        options: [
          {
            title: 'Lo encontró',
            text: 'Ábralo y elija la opción para reclamar el negocio (en inglés dice "Claim this business") y luego "Manage now" (administrar ahora).',
            goTo: { label: 'Pase al paso 7 para verificarlo', step: 7 },
          },
          {
            title: 'No aparece',
            goTo: { label: 'Siga al paso 2', step: 2 },
          },
        ],
        note: '¿Encontró su negocio pero alguien más ya lo administra? No cree un segundo perfil. Llámenos y le ayudamos a aclarar quién tiene acceso.',
        noteCall: true,
      },
      {
        title: 'Empiece su perfil',
        body: [
          'Entre a business.google.com/add con la cuenta de Google que eligió. Primero Google le pide escribir el nombre de su negocio, para buscarlo una vez más. Si no aparece, elija la opción para agregar su negocio a Google (en inglés dice "Add your business to Google") y siga las instrucciones.',
        ],
        action: { label: 'Abrir business.google.com/add', href: googlePages.add },
        image: {
          ...screenshot,
          alt: 'Pantalla de inicio de Perfil de Negocio en Google, con un cuadro para escribir el nombre del negocio y el enlace "Add your business to Google"',
          caption: 'La primera pantalla en business.google.com/add, con Google en inglés (noviembre de 2026).',
        },
      },
      {
        title: 'Escriba el nombre real de su negocio',
        body: [
          'Use el nombre que sus clientes ven en su letrero, sus facturas y su sitio web. Nada más. Google dice que agregar información de más al nombre puede hacer que suspendan el perfil.',
        ],
        bullets: [
          'Sin nombres de ciudades o zonas ("cerca del centro de McAllen").',
          'Sin servicios, frases de publicidad, horarios, teléfonos ni páginas web.',
          'Sin palabras TODO EN MAYÚSCULAS.',
          'LLC o Inc. solo si de verdad aparece en su letrero o sus facturas.',
        ],
        example: {
          good: { label: 'Bien', text: 'Plomería Garza' },
          bad: { label: 'Le causa problemas', text: 'Plomería Garza McAllen Destapes 24 Horas' },
        },
      },
      {
        title: 'Elija su categoría',
        body: [
          'Elija la categoría que completa la frase "Este negocio es un ___." Escoja la más específica que le quede. Si la suya no está en la lista, elija una más general. No puede inventar una nueva.',
          'Use la menor cantidad de categorías posible. Los servicios que ofrece van en la sección de servicios más adelante, no en las categorías.',
        ],
      },
      {
        title: 'Dirección o área de servicio',
        body: [],
        options: [
          {
            title: 'Sus clientes van a su local',
            text: 'Ponga la dirección. Hágalo solo si tiene un letrero fijo y personal ahí durante su horario.',
          },
          {
            title: 'Usted va con el cliente',
            text: 'Servicios para el hogar, trabajo móvil, seguridad, limpieza. No muestre la dirección en el perfil y ponga las zonas donde trabaja. Trabajar desde su casa está bien. El ejemplo que usa Google es un plomero que trabaja desde su casa.',
            bullets: [
              'Hasta 20 áreas de servicio, por ciudad o código postal.',
              'Sin radio en millas. Google no lo permite.',
              'Que las zonas queden a unas 2 horas manejando de su base, como máximo.',
            ],
          },
        ],
      },
      {
        title: 'Agregue su teléfono y su página web',
        body: [
          'Ponga el número que usted contesta. ¿No tiene página web todavía? Lo puede dejar en blanco y agregarla después.',
        ],
      },
      {
        title: 'Verifique su negocio',
        body: [
          'Google escoge el método de verificación por usted, según su tipo de negocio, la información pública, su región y su horario. No lo puede cambiar, y Google le puede pedir más de uno. Las opciones son un texto o llamada, un correo electrónico, una videollamada en vivo, un video grabado o una tarjeta postal.',
        ],
        methods: [
          {
            name: 'Video grabado',
            tag: 'Google lo recomienda cuando se lo ofrece',
            text: 'Por lo menos 30 segundos, en una sola toma, sin editar, grabado y subido desde su celular dentro del perfil. Muestre:',
            points: [
              'Dónde está: letreros de la calle, el número de su dirección, lugares conocidos.',
              'Que el negocio es real: equipo, herramientas, camisas o vehículo con su marca.',
              'Que usted lo maneja: un permiso, factura o recibo a nombre del negocio.',
            ],
            after: 'No muestre caras de otras personas ni información privada.',
          },
          {
            name: 'Videollamada en vivo',
            text: 'Solo durante su horario de atención. Tenga las mismas pruebas a la mano.',
          },
          {
            name: 'Texto o llamada',
            text: 'Usted tiene que contestar el teléfono del negocio. Un menú automático no recibe el código.',
          },
          {
            name: 'Tarjeta postal',
            text: 'Llega en un plazo de 14 días y el código vence a los 30. Mientras espera, no cambie su nombre, dirección ni categoría, y no pida un segundo código.',
          },
        ],
        note: 'Google dice que la revisión tarda hasta 5 días hábiles en la mayoría de los casos. Le llega un correo cuando termina.',
      },
      {
        title: 'Complete su perfil cuando ya esté verificado',
        body: [
          'Agregue o corrija sus áreas de servicio (en la edición del perfil, en la sección de ubicación, área de servicio), su horario, fotos reales y sus servicios. Los cambios pueden tardar hasta 48 horas en aparecer.',
          'Cambiar el nombre, la dirección o la categoría después puede pedirle verificar otra vez, así que déjelos bien desde ahora.',
        ],
      },
    ],
    mistakesHeading: 'Errores que atoran un perfil nuevo',
    mistakes: [
      'Crear un segundo perfil cuando Google ya tenía uno de su negocio.',
      'Agregar su ciudad o sus servicios al nombre del negocio.',
      'Mostrar una dirección donde los clientes no pueden llegar a atenderse.',
      'Cambiar el nombre, la dirección o la categoría mientras la verificación está pendiente.',
      'Crearlo con la cuenta personal de Google de un empleado.',
    ],
    faqHeading: 'Preguntas sobre cómo crear su perfil',
    faqs: [
      {
        question: '¿Cuesta algo el Perfil de Negocio en Google?',
        answer: 'No. Crear y verificar un Perfil de Negocio en Google es gratis.',
      },
      {
        question: '¿Cuánto tarda en aparecer mi negocio?',
        answer:
          'Google dice que la revisión de la verificación tarda hasta 5 días hábiles en la mayoría de los casos, y una tarjeta postal puede tardar hasta 14 días en llegar. Aparecer en el mapa no es lo mismo que aparecer primero. Su lugar depende de qué tan bien coincide con la búsqueda, qué tan cerca está y qué tan conocido es su negocio.',
      },
      {
        question: 'Trabajo desde mi casa o voy con mis clientes. ¿Puedo tener perfil?',
        answer:
          'Sí. Oculte su dirección y ponga su área de servicio, hasta 20 ciudades o códigos postales. Google lo permite para negocios que atienden a sus clientes donde ellos están.',
      },
      {
        question: 'Me rechazaron el video de verificación. ¿Qué hago?',
        answer:
          'Grabe uno nuevo en una sola toma. Asegúrese de que muestre dónde está, el equipo o las herramientas de su trabajo y un documento con el nombre de su negocio.',
      },
      {
        question: '¿RankRGV me lo puede crear?',
        answer:
          'Le podemos ayudar paso a paso en una llamada. El perfil debe quedar en su propia cuenta de Google, para que siempre sea suyo. Si quiere ayuda para mantenerlo activo cuando ya esté publicado, para eso es nuestro Plan Más Llamadas.',
      },
    ],
    sourcesHeading: 'De dónde salen estas reglas',
    sourcesIntro: 'Cada regla de esta guía viene del centro de ayuda de Perfil de Negocio de Google:',
    sourcesChecked: 'Revisado el 23 de noviembre de 2026. Google actualiza estas páginas de vez en cuando.',
    sources: [
      { label: 'Agregar o reclamar su Perfil de Negocio', href: `${googleSources.add}?hl=es` },
      { label: 'Verificar su negocio en Google', href: `${googleSources.verify}?hl=es` },
      { label: 'Verificar su negocio con un video', href: `${googleSources.video}?hl=es` },
      { label: 'Lineamientos para representar su negocio en Google', href: `${googleSources.guidelines}?hl=es` },
      { label: 'Administrar su área de servicio', href: `${googleSources.serviceArea}?hl=es` },
      { label: 'Administrar la categoría de su negocio', href: `${googleSources.category}?hl=es` },
    ],
    ctaHeadline: '¿Ya está publicado su perfil? Vea cómo se compara.',
    ctaSub: 'Haga la revisión gratis. Compara su perfil con los negocios que aparecen junto a usted en el mapa.',
    ctaPrimary: 'Revisar mi perfil gratis',
    ctaSecondary: 'Llamar al',
    breadcrumbHome: 'Inicio',
    breadcrumbLabel: 'Crear perfil de Google',
    moreLink: { label: 'Más sobre el Plan Más Llamadas', href: '/es/plan-mas-llamadas/' },
  },
};
