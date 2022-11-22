import { fields } from "../fields";
import { swedishCookies } from "./swedish/cookies";
import { swedishFaq } from "./swedish/faq";
import { swedishReleasenotes } from "./swedish/releasenotes";
import { swedishPrivacy } from "./swedish/privacy";

export const swedishStrings = {
  sidemenuStart: 'Utbildningar',
  sidemenuCategories: 'Kategorier',
  sidemenuMyAccount: 'Konton',
  sidemenuOrgAccount: 'Organisationskonto',
  sidemenuMyEducations: 'Mina utbildningar',
  sidemenuFavEducations: 'Sparade utbildningar',
  sidemenuMyAds: 'Mina efterlysningar',
  sidemenuFavAds: 'Sparade efterlysningar',
  sidemenuRequests: 'Efterlysningar',
  signup: {
    header: 'Skapa konto',
    or: '| ',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    email: 'E-post',
    orgNumber: 'Organisationsnummer',
    orgName: "Organisationens namn",
    language: 'Önskat språk',
    usage: 'Hur ska du använda Kompetensmatchning?',
    gdpr: 'Jag godkänner att vår data lagras enligt GDPR.',
    usageAlternatives: {
      search: 'Söka utbildningar',
      offer: 'Erbjuda utbildningar',
      searchAndOffer: 'Söka och erbjuda utbildningar'
    },
    languageAlternatives: {
      english: 'Engelska',
      swedish: 'Svenska'
    },
    emailPreference: 'Jag önskar ta emot nyhetsbrev från Kompetensmatchning till den angivna e-postadressen',
    password: 'Välj lösenord',
    repeatPassword: 'Upprepa lösenord',
    confirmPassword: 'Bekräfta lösenord',
    errors: {
      invalidOrgid: 'Organisationsnumret måste vara i formatet XXXXXX-XXXX',
      passwordMismatch: 'Lösenorden matchar inte',
      usernameTaken: (email) =>  `E-postadressen ${email} är redan upptagen`,
    },
    placeholders: {
      firstName: 'Ditt förnamn',
      lastName: 'Ditt efternamn',
      email: 'Din e-post',
      orgNumber: 'ex. 010101-0101',
      language: 'Välj språk ...',
      orgName: 'ex. Företag AB',
      usage: 'Välj ett alternativ från listan',
    },
    almostReadyHeader:'Nästan klar: Kontoverifikation',
    almostReadyText: 'Kompetensmatchning håller på att verifiera ditt organisationsnummer med din personliga information. Vi kommer informera dig via mail när det är klart.',
    almostReadyConfirmation: 'Jag förstår',
  },
  resetPassword: {
    header: 'Återställ lösenord',
    description: 'Ingen fara, du kan återställa ditt lösenord här. Fyll i din e-postadress som kontot är kopplat till så mejlar vi det du behöver för att skapa ett nytt lösenord.',
    confirm: 'Du kommer inom kort att få ett e-postmeddelande för att återställa ditt lösenord. Om inte, gärna dubbelkolla ditt e-post.',
    send: 'Skicka',
  },
  mainTabLearn: 'Sök utbildning',
  mainTabLearnMobile: 'Sök',
  mainTabEducate: 'Erbjud utbildning',
  mainTabEducateMobile: 'Erbjud',
  learnStartText: 'Välkommen! Här kan du som yrkesverksam söka eller göra efterlysningar för utbildningar som matchar just ditt eller din organisations behov av kompetensutveckling.',
  learnStartPostsTitle: 'Publicerade utbildningar',
  favoritePostsTitle: 'Sparade utbildningar',
  loadMoreCourses: 'Ladda fler kurser',
  offerOverview: 'Översikt',
  offerAdd: 'Lägg till ny utbildning',
  offerRequest: 'Skapa ny efterlysning',
  courseEdit: 'Redigera utbildning',
  inquiryEdit: 'Redigera efterlysning',
  share: 'Dela',
  favorite: 'Favorit',
  requestInvoice: 'Begär offert',
  login: 'Logga in',
  logout: 'Logga ut',
  invalidLogin: 'Felaktiga inloggningsuppgifter, kontrollera att du har angett rätt mail och lösenord.',
  loggedAs: 'Inloggad som:',
  email: 'E-post',
  password: 'Lösenord',
  forgotPassword: 'Glömt lösenordet?',
  changePassword: 'Byt lösenord',
  seeCourseExternal: 'Se utbildning hos arrangör',
  sortBy: 'Sortera efter:',
  editUserInfo: 'Ändra användarinformation',
  addEducation: {
    save: 'spara',
    viewpreview:'förhandsvisning',
    publish: 'publicera',
  },
  course: {
    title: 'Utbildningens titel',
    summary: 'Sammanfattning',
    credits: 'Högskolepoäng',
    creditsprof: 'Yrkeshögskolepoäng',
    hours: 'Timmar',
    provider: 'Arrangör',
    providerLogo: 'Logo arrangör',
    contentHeader: 'Innehåll',
    scopeHeader: 'Omfattning',
    datefreq:'Datum och frekvens',
    otherRubrik: 'Övrigt',
    levelHeader: 'Nivå',
    formatHeader: 'Format',
    maindetailsHeader: 'Detaljer om utbildningen',
    description: 'Beskrivning',
    content: 'Kursens innehåll',
    tools:'Verktyg',
    url:'Webblänk till orginalkurs',
    prerequisites:'Förkunskaper',
    literature:'Kurslitteratur',
    teachers:'Utbildare',
    teachersBio:'Om utbildare',
    contact:'Kontaktperson',
    contactEmail: 'E-post kontaktperson',
    verbs:'Aktiviteter',
    keywords: 'Nyckelord',
    level: 'Nivå',
    requestedOffers: 'Begärda offerter',
    status: 'status',
    chooseLevel: 'Välj nivå...',
    levels: {
      basic: 'Gymnasial',
      medium: 'Eftergymnasial',
      advanced: 'Högskolekurs',
    },
    format: 'Undervisningsformat',
    chooseFormat: 'Välj format ...',
    formats: {
      onlocation: 'På plats',
      distance: 'Distans',
      eveningcourse: 'Kvällskurs',
      singleday: 'En dag',
      halfday: 'En halv dag',
      weekend: 'Helgkurs',
      other: 'Annat',
    },
    certificates: 'Certifikat & diplom',
    target: 'Målgrupp',
    featureImage: 'Presentationsbild',
    detailHeader: 'Filter och detaljer',
    category: 'Kategori',
    chooseCategory: 'Välj kategori ...',
    cost: 'Kostnad',
    frequensType: 'Frekvens typ',
    frequensItems: {
      date: 'Ett eller flera datum',
      other: 'Annat ...',
    },
    city: 'Utbildningsort',
    start: 'Startdatum',
    registerDate: 'Sista anmälningsdag',
    price: 'Pris',
    otherFrequensType: 'Annan typ av frekvens',
    end: 'Slutdatum',
    listingStart: 'Visa kursannons från',
    listingEnd: 'Ta bort kursannons efter',
    pace: 'Studietakt',
    other: 'annat',
    choosePace: 'Välj studietakt ...',
    language: 'Studiespråk',
    chooseLanguage: 'Välj språk ...',
    languageList: [
      'Svenska',
      'Engelska'
    ],
    seqf: 'SeQF-level',
    chooseSeqf: 'Välj SeQF-nivå ...',
    seqfList: {
      one: '1',
      two: '2',
      three: '3',
      four: '4',
      five: '5',
      six: '6',
      seven: '7'
    },
    teacher: 'Lärare',
    teacherBio: 'Beskrivning lärare',
    teacherImage: 'Bild på lärare',
    link: 'Länk till originalutbildning',
    contactHeader: 'Kontakt & begär offert',
    imagesHeader: 'Bildmaterial',
    contactPerson: 'Namn kontaktperson',
    contactEmail: 'E-post kontaktperson',
    dates: 'Studieperiod',
    showMore: 'Mer info',
    more: 'Läs mer',
    save: 'Spara',
    statuses: {
      [fields.record_status.draft]: 'Utkast',
      [fields.record_status.approved]: 'Publicerad',
      [fields.record_status.archived]: 'Arkiverad'
    },
    metatitleOne: "Nivå & Format",
    metatitleTwo: "Verktyg & Kunskap",
    metatitleThree: "Övrigt",
    popup: {
      title: 'Skriv utbildningens titel',
      provider: 'Texten här hämtas från ditt konto, om den behöver ändras kan det göras från kontosidan',
      link: 'Ange länk till webbsida där det går att anmäla sig till kursen.',
      subtitle: 'Beskriv kortfattat syftet med utbildningen',
      description: 'Beskriv utbildningens innehåll och lärmål.',
      tools: 'Beskriv vilka specifika program eller verktyg som behövs',
      prerequisites: 'Beskriv vilka förkunskaper som behövs för utbildningen',
      literature: 'Vilken kurslitteratur behövs',
      verbs: 'Beskriv med aktiva verb (separerade med komma) utbildningens innehåll. Tex. bygga, testa, skriva',
      credits: 'Hur många högskolepoäng omfattar utbildningen?',
      creditsprof: 'Hur många yrkeshögskolepoäng omfattar utbildningen?',
      hours: 'Ange antal timmar utbildningen är på',
      level: 'Vilken nivå är utbildningen på',
      seqf: 'Ange MYH-certifierad SeQF-nivå (https://www.seqf.se/sv/Sa-funkar-det/Ansokan/)',
      pace: 'Ange studietakt',
      usage: 'Kompetensmatchningen.se är en plattform för företag som söker eller/och erbjuder utbildningar, du kan altid ändra denna preferens vid ett senare tillfälle i dina konto inställningar.',
      format: 'Ange undervisningsformat',
      start: 'Ange startdatum (om relevant)',
      registerDate: 'Ange sista anmälningsdag (om relevant)',
      price: 'Ange kostnader för kursen i SEK (om relevant)',
      end: 'Ange slutdatum (om relevant)',
      city: 'Ange ort (om relevant)',
      teacher: 'Ange lärare',
      teacherBio: 'Skriv en kort beskrivning av läraren/lärarna',
      certificates: 'Vilka resultat, kompetenser och kunskaper förväntas man av utbildningen?',
      category: 'Ange vilken kategori utbildningen skall hamna under',
      providerLogo: 'Ange befintlig eller ladd upp ny logotyp för organisationen',
      featureImage: 'Ladda upp en presentationsbild för utbildning (minimum 600 pixlar bred och 400 pixlar hög).',
      contactPerson: 'Ange vem som är kursansvarig och som kan hantera offerter',
      contactEmail: 'Ange espotadress till kursansvarig',
      confirmDeleteCourse: {
        title: 'Radera eller arkivera ', //END WITH A SPACE!
        message: 'Är du säker på att du vill ta bort den här kursen? Om du arkivera kursen kommer den att finnas kvar som "inaktivt".',
        button: {
          remove: 'Radera',
          archive: 'Arkivera',
          cancel: 'Avbryt',
        }
      }
    },
  },
  search : {
    learnPlaceholder:'Sök utbildning, t.ex. ledarskap',
    eduPlaceholder:'Sök efterlysning, t.ex. ledarskap',
    result: 'Sökresultat',
    filterHeader: 'Filtrera bland utbildningarna',
    filter: 'Filtrera',
  },
  placeholders : {
    title:'Fyll i titeln här',
    summary:'Kort sammanfattande text om utbildningen',
    message: 'Beskriv eller förtydliga dina önskemål...',
    provider:'T ex utbildningsanordnare eller högskola',
    description:'Beskrivning av utbildningens innehåll',
    tools:'Vilka verktyg behövs?',
    prerequisite:'Vilken förkunskap krävs?',
    literature:'Vilken litteratur behövs?',
    verbs:'Lista aktiviteter',
    credits:'Hur många poäng får man?',
    creditsprof:'Hur många poäng får man?',
    hours: 'Hur många timmar är utbildningen?',
    certificates:'Vad för utbildningscertifikat får man?',
    price: 'tex. 30 000',
    city:'I vilken ort sker utbildningen?',
    start:'dd/mm/yyyy',
    date: 'dag månad, år',
    frequensType: 'Valj frekvens typ ...',
    otherFrequensType: 't ex flexibel, löpande osv.',
    end:'dd/mm/yyyy',
    teacher:'Lärarens namn',
    teacherBio:'Kort om läraren ...',
    contactPerson:'Utbildningens kontaktperson',
    contactEmail:'T ex contact@email.com',
    url:'T ex http://www.website.com/education/course1',
  },
  offer : {
    frontTitle:'Sveriges företag behöver din utbildning.',
    frontText:'Vårt mål är att främja livslångt lärande. Vi vill att företag och organisationer i Sverige ska kunna enkelt hitta era utbildningar så de kan fortsätta att utveckla och fortbilda sina medarbetare.',
    partnerTitle: 'Några företag som redan är kopplade till tjänsten',
  },
  request: {
    activeHeader: 'Aktiva efterlysningar',
    archivedHeader: 'Arkiverade efterlysningar',
    startdate: 'Startdatum',
    type: 'Vad söker du?',
    popup: 'Begär offert',
    button: 'Begär offert',
    sendCopy: 'Jag vill ta emot en kopia på denna begäran via mail.',
    extraMessage: (name) => `När du begär en offert från ${name}, kommer vi skicka kontaktuppgifterna nedan till hen.`,
    message: 'Ditt meddelande till kursanordnaren',
    description: 'Beskrivning',
    addDesc: 'Hittar du inte den utbildning du söker? Här kan du skapa en efterlysning.',
    editDesc: 'Redigera din befintliga efterlysning.',
    category: 'Kategori',
    place: 'Önskad utbildningsort',
    start: 'Tidigast datum för start',
    end: 'Senast datum för avslut',
    studyPace: 'Önskad studietakt',
    contactName:'Namn kontaktperson',
    contactMail:'E-post kontaktperson',
    contactPhone:'Telefon kontaktperson',
    targets: {
      [fields.inquiryTarget.coaching]: 'Coachning',
      [fields.inquiryTarget.education]: 'Utbildning',
    },
    title: 'Titel',
    listTitle: 'Senaste efterlysningar',
    listAllButton: 'Alla efterlysningar',
    placeholders : {
      type:'Typ av efterlysning ...',
      description: 'Använd max. XXX ord',
      category: 'Välj en kategori ...',
      place: 't ex Umeå',
      start:'Välj',
      end:'Välj',
      studyPace:'Ange önskad studietakt',
      contactName:'t ex Mia Jonsson',
      contactMail:'t ex namn.efternamn@företag.se',
      contactPhone:'t ex 0700080200',
      title: 'Ange efterlysningens titel här'
    },
    deletePopup: {
      title: 'Radera eller arkivera ', //END WITH A SPACE!
      message: 'Är du säker på att du vill ta bort den här efterlysningen? Om du arkiverar efterlysningen kommer den att finnas kvar som "inaktiv".',
      button: {
        remove: 'Radera',
        archive: 'Arkivera',
        cancel: 'Avbryt',
      }
    }
  },
  footer : {
    title: 'Kompetensmatchning ÄR EN TJÄNST UTVECKLAD AV RISE',
    description: 'Kompetensmatchning är en tjänst som utvecklas i samverkan mellan RISE och Göteborgsregionens kompetensnav.  RISE Research Institutes of Sweden är Sveriges forskningsinstitut och innovationspartner. RISE är ett oberoende, statligt forskningsinstitut som erbjuder unik expertis och ett 100-tal test- och demonstrationsmiljöer för framtidssäkra teknologier, produkter och tjänster.',
    moreInfo: 'mer information',
    cookies: 'Cookies',
    faq: 'Frågor & svar',
    contact: 'Kontakta oss',
    privacy: 'Personuppgifter',
  },
  contact : {
    heading: 'Kontakta oss',
  },
  account : {
    companyAccount: 'organisationskonto',
    userAccount: 'Användare',
    deleteButton: 'Ta bort användare',
    addButton: 'Lägg till användare',
    editButton: 'Redigera konto',
    passwordButton: 'Ändra lösenord',
    contactAdminButton: 'Kontakta kontoadministratör',
    admins: 'Administratörer',
    users: 'Användare',
    address: 'Adress',
    contactInfo: 'Kontaktuppgifter',
    contactPerson: 'Kontaktpersoner',
    header: 'Mitt konto',
    admin: 'Administratörskonto för organisation',
    member: 'Medlemskonto för organisationen',
    connectedTo: 'Ditt konto är kopplat till',
    usageAlternatives: [
      'Söker utbildningar',
      'Erbjuder utbildningar',
      'Söker och erbjuder utbildningar'
    ],
    yrkesakademin: 'Yrkesakademin',
    popup: {
      title: 'Redigera din organisations uppgifter',
      disclaimer: 'De ändringar du gör kommer påverka all information för din organisation på denna sida för samtliga konton kopplade till organisationen',
      orgName: 'Din organisations namn',
      homepage: 'Länk till organisationens hemsida',
      description: 'Kort beskrivning om din organisation',
      address: 'Din organisations adress',
      imageUpload: 'Ladda upp din organisations logotyp. Fileformat som stöds: JPG, JPEG, PNG', 
      email: 'Din organisations e-post',
      phonenumber: 'Telefonnummer till ',
      buttonSave: 'Spara',
      buttonCancel: 'Avbryt',
      placeholders: {
        orgName: 't ex Company Nation AB',
        homepage: 't ex www.company-nation.se',
        description: 'Organisation är fokusserad på ...',
        address: 't ex Gatunamn 56, 68292, Stad, Land',
        email: 'T ex info@company-nation.se',
        phonenumber: 'T ex 0046829826829'
      },
    },
  },
  about: {
    pageTitle: 'Om Kompetensmatchning',
    about: 'Detta är Kompetensmatchning',
    aboutText: 'Kompetensmatchning är en mötesplats för kompetensutveckling som primärt riktar sig mot arbetsgivare och utbildningsanordnare som har behov av eller jobbar med kompetensutveckling för yrkesverksamma. Plattformen tar ett avstamp i Västra Götaland och de behov som är identiferade i fordonsindustrin, service och besöksnäringen. Kompetensmatchning är en tjänst som utvecklas i samverkan mellan RISE och Göteborgsregionens kompetensnav. ',
    mission: 'Mål med denna tjänst',
    missionText: 'Vi vill med Kompetensmatchning erbjuda en mötes- och marknadsplats; en mötesplats som ger arbetsgivare och utbildningsanordnare möjlighet att mötas och samverka om tex vilken typ av kompetensutveckling det finns behov av, och en marknadsplats där det är enkelt att hitta rätt typ av utbildning för kompetensutveckling av yrkesverksamma.',
  },
  faq: swedishFaq,
  releasenotes: swedishReleasenotes,
  privacy: swedishPrivacy,
  cookies: swedishCookies,
  categories: {
    all: 'Alla kategorier',
    [fields.categories.ai.slug]: 'Artificiell Intelligens',
    [fields.categories.economy.slug]: 'Ekonomi & handel',
    [fields.categories.leadership.slug]: 'Ledarskap',
    [fields.categories.transport.slug]: 'Transport & logistik',
    [fields.categories.digitization.slug]: 'Digitalisering',
    [fields.categories.environment.slug]: 'Miljö & hållbarhet', 
    [fields.categories.it.slug]: 'Data & IT',
    [fields.categories.design.slug]: 'Design & media',
    [fields.categories.electrification.slug]: 'Elektrifiering',
    [fields.categories.marketing.slug]: 'Marknadsföring & kommunikation',
    [fields.categories.hr.slug]: 'HR & Personal',
    [fields.categories.materials.slug]: 'Material, konstruktion & tillverkning',
    [fields.categories.health.slug]: 'Vård & hälsa',
    [fields.categories.film.slug]: 'Film & TV-produktion',
  },
  languages: {
    [fields.languages.swedish.slug]: 'Svenska',
    [fields.languages.english.slug]: 'Engelska',
  },
  overview: {
    activeCourses: 'Aktiva kurser',
    archivedCourses: 'arkiverade kurser',
    status: 'status',
    quotationRequests: 'begärda offerter',
    startDate: 'startdatum',
    edit: 'redigera',
    remove: 'ta bort',
  },
  popup: {
    OrgReminderPopup: {
      title: 'Vänligen fyll in dina uppgifter',
      message: 'Du har inte fyllt i uppgifter för organisationen än, för att kunna använda tjänsten behöver du åtminstone ladda upp en logotyp.',
      button: "Till organisationskonto",
    },
    AddEducationOwnerPopup: {
      title: 'Lägg till ägare till kursen:',
      owner: 'Nuvarande ägare',
      cancel: 'Avbryt',
      save: 'Spara',
    },
    ConfirmCoursePopup: {
      titlePublished: 'Din kurs är publicerad!',
      titleNotPublished: 'Din kurs är sparad!',
      overview: 'Gå till översikt',
      create: 'Skapa ny kurs',
    }
  },
  forbidden: {
    title: 'Begränsad åtkomst',
    info: 'Denna sida är begränsad till registrerade användare. Logga in eller skapa en användare för att se sidans innehåll.'
  }
} //END SwedishStrings
