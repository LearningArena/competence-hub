import { englishFaq } from "./english/faq";
import { englishReleasenotes } from "./english/releasenotes";
import { fields } from "../fields";

export const englishStrings = {
  siteTitle: 'CompetenceHub',
  catchphrase: "Arena for lifelong learning",
  sidemenuStart: 'Educations',
  sidemenuCategories: 'Categories',
  sidemenuMyAccount: 'My account',
  sidemenuOrgAccount: 'Organistation Account',
  sidemenuMyEducations: 'My educations',
  sidemenuFavEducations: 'Favourite educations',
  sidemenuMyAds: 'My Inquiries',
  sidemenuFavAds: 'Sparade Efterlysningar',
  sidemenuRequests: 'Inquiries',
  signup: {
    header: 'Create account',
    or: 'Or ',
    firstName: 'First name',
    lastName: 'Surname',
    email: 'Email',
    orgNumber: 'Organisation number',
    orgName: "Organisation's name",
    language: 'Language preference',
    usage: 'How do you intend to use this site?',
    gdpr: 'I accept that our data is stored according to GDPR.',
    usageAlternatives: {
      search: 'Look for educations',
      offer: 'Offer educations',
      searchAndOffer: 'Look for and offer educations'
    },
    languageAlternatives: {
      english: 'English',
      swedish: 'Swedish'
    },
   emailPreference: 'I wish to receive news letters from this service to the given email address',
    password: 'Choose password',
    repeatPassword: 'Repeat password',
    confirmPassword: 'Confirm password',
    errors: {
      invalidOrgid: 'The organisation number has to be in the format XXXXXX-XXXX',
      passwordMismatch: 'The password does not match',
      usernameTaken: (email) =>  `The email ${email} is already in use`,
    },
    placeholders: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Your email here',
      orgNumber: 'i.e 010101-0101',
      language: 'Choose language ...',
      orgName: 'eg. Company AB',
      usage: 'Choose an alternative from the list',
    },
    almostReadyHeader:'Almost ready: Account verification',
    almostReadyText: 'This service is verifying your organisationnumber with your personal information. We will inform you when it is ready.',
    almostReadyConfirmation: 'I understand',
  },
  resetPassword: {
    header: 'Reset password',
    description: 'Don\'t worry, you can reset your password here. Fill in the email that is connected to your accound and we will send you a new password.',
    confirm: 'You will shortly receive an e-mail to reset your password. If you have not, please check your e-mail.',
    send: 'Send',
  },
  publishedCoursesOverview: 'Published courses',
  draftCoursesOverview: 'Drafts',
  archivedCoursesOverview: 'Archived courses',
  mainTabLearn: 'Search education',
  mainTabEducate: 'Offer education',
  learnStartText: 'Description of the website and its use',
  learnStartPostsTitle: 'Published courses',
  favoritePostsTitle: 'Saved educations',
  offerOverview: 'Overview',
  offerOrgOverview: 'Organization Overview',
  loadMoreCourses: 'Load more courses',
  offerAdd: 'Add new education',
  offerRequest: 'Create new inquiry',
  courseEdit: 'Edit education',
  inquiryEdit: 'Edit inquiry',
  share: 'Share',
  favorite: 'Favorite',
  requestInvoice: 'request for quotation',
  login: 'Sign in',
  logout: 'Sign out',
  invalidLogin: 'Invalid user credentials, check that you have provided the correct email and password.',
  loggedAs: 'Currently signed in as:',
  email: 'E-mail.',
  password: 'Password',
  forgotPassword: 'Forgot password?',
  changePassword: 'Change password',
  seeCourseExternal: 'List education by provider',
  sortBy: 'Sort by:',
  editUserInfo: 'Edit user information',
  addEducation: {
    save: 'save',
    viewpreview:'Show preview',
    publish: 'publish',
  },
  course: {
    title: 'Name of education',
    publishedBy: 'Published by',
    importedFrom: 'Imported from',
    summary: 'Summary',
    credits: 'Higher education credits',
    creditsprof: 'Yrkeshögskola credits',
    hours: 'Study hours',
    orgAccount: 'Organization',
    provider: 'Provider',
    providerLogo: 'Logo provider',
    contentHeader: 'Table of content',
    scopeHeader: 'Scope',
    levelHeader: 'Level',
    otherRubrik: 'Other',
    formatHeader: 'Format',
    datefreq:'Date och frequency',
    maindetailsHeader: 'Table of content main',
    maindetailsImportWarning: 'Course data imported - most info not editable!',
    description: 'Description',
    content: 'Course content',
    tools:'Required tools',
    url:'Webpage link to course',
    prerequisites:'Prerequisites',
    literature:'Course literature',
    teachers:'Educators',
    teachersBio:'About educators',
    contact: 'Contact person',
    contactEmail: 'E-mail Contact person',
    verbs:'Activities',
    keywords: 'Keywords',
    level: 'Level',
    requestedOffers: 'requested for quotations',
    status: 'status',
    chooseLevel: 'Choose level...',
    levels: {
      basic: 'Upper secondary school (basic)',
      medium: 'Post upper secondary school (medium)',
      advanced: 'High School/University (advanced)',
    },
    format: 'Education form',
    chooseFormat: 'Choose form...',
    formats: {
      onlocation: 'On location',
      distance: 'Distance',
      eveningcourse: 'Night course',
      singleday: 'One day',
      halfday: 'One half day',
      weekend: 'Weekend Course',
      other: 'Other',
    },
   certificates: 'Certificates & diplomas',
    target: 'Target group',
    featureImage: 'Featured image',
    detailHeader: 'Filter and details',
    category: 'Category',
    chooseCategory: 'Choose category...',
    frequensType: 'Frequency type',
    frequensItems: {
      date: 'One or more dates',
      other: 'Other...',
    },
    cost: 'Cost',
    price: 'Price',
    city: 'City',
    start: 'Start Date',
    registerDate: 'Final registration date',
    otherFrequensType: 'Other types of frequency',
    end: 'End Date',
    listingStart: 'Show course add from',
    listingEnd: 'Remove course after',
    pace: 'Study pace',
    other: 'other',
    choosePace: 'Choose study pace...',
    language: 'Study language',
    import_source: 'Import source',
    chooseLanguage: 'Choose language...',
    languageList: [
      'Swedish',
      'English'
    ],
    seqf: 'SeQF-level',
    chooseSeqf: 'Pick SeQF-level...',
    seqfList: {
      one: '1',
      two: '2',
      three: '3',
      four: '4',
      five: '5',
      six: '6',
      seven: '7'
    },
     teacher: 'Teacher',
    teacherBio: 'Description of teacher',
    teacherImage: 'Picture of teacher',
    link: 'Link to original educatiton',
    contactHeader: 'Contact & request for quotation information',
    imagesHeader: 'Image material',
      contactPerson: 'Name of contact person',
    contactEmail: 'E-mail of contact person',
    dates: 'Study period',
    showMore: 'More info',
    more: 'Read more',
    save: 'Save',
    statuses: {
      [fields.record_status.draft]: 'Draft',
      [fields.record_status.approved]: 'Published',
      [fields.record_status.archived]: 'Archived'
    },
    metatitleOne: "Level & Form",
    metatitleTwo: "Tools & knowledge",
    metatitleThree: "Other",
    popup: {
      title: 'Title of the education',
      provider: 'Registration link page',
      link: 'Link to education registration page',
      subtitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos deserunt deleniti eaque vitae vel sint quibusdam dolor commodi laborum numquam veniam quod praesentium officiis soluta labore iusto, tenetur ea fuga. Quis magnam minima quibusdam possimus nisi modi tenetur pariatur itaque.',
      description: 'Short description of the education',
      tools: 'Wat tools (hardware, software etc) that are needed?',
      prerequisites: 'What prerequisites that are needed?',
      price: 'Enter the price for this course in SEK (if relevant)',
      literature: 'What course litterature is needed?',
      verbs: 'Use active verbs (seperated by commas) to describe the education. Eg. building, exploring, writing ',
      credits: 'How many higher education credits is the education worth?',
      creditsprof: 'How many HVE credits is the education worth?',
      hours: 'How many hours is the education?',
      level: 'Which level is the education at?',
      seqf: 'Enter MYH-certified SeQF level (https://www.seqf.se/sv/Sa-funkar-det/Ansokan/)',
      pace: 'enter study pace',
      usage: 'Are you offering or looking for educations?',
      format: 'Enter study form',
      start: 'Enter start date (if relevant)',
      registerDate: 'Enter final registration date (if relevant)',
      end: 'Enter slutdatum (if relevant)',
      city: 'Enter place (if relevant)',
      teacher: 'Enter teacher',
      teacherBio: 'Short description of the teacher',
      certificates: 'What results, skills and knowledges can one expected to gain from the education??',
      category: 'How shall the course be categorized?',
      providerLogo: 'Use current or add a new logo for the education',
      featureImage: 'Upload an presentation image for the education (minimum 600 pixels wide, minumum 400 pixels high).',
      contactPerson: 'Enter contact person for the education (who will handle any offers/requests)',
      contactEmail: 'Enter e-post adress for contact person',
      confirmDeleteCourse: {
        title: 'Remove or archive ', //END WITH A SPACE!
        message: 'Are you sure you would like to remove this course? If you move the course to archive the course will remain available but inactive.',
        button: {
          remove: 'Remove',
          archive: 'Archive',
          cancel: 'Cancel',
        }
      }
    },
  },
  search : {
    learnPlaceholder:'Search for an education, e.g. leadership',
    eduPlaceholder:'Search for an inquiry, e.g. leadership',
    result: 'Search result',
    filterHeader: 'Filter search',
    filter: 'Filter',
    searchButtonAria: 'Search for an education',
  },
  placeholders : {
    title:'Fill in your title',
    summary:'Summary about the education',
    message: 'Describe or clarify your request for quotation...',
    provider:'e.g. educational institute',
    description:'Description of education',
    tools:'What tools are needed',
    prerequisite:'What prior knowledge is needed?',
    literature:'What litterature is needed?',
    verbs:'Description of activity',
    credits:'How many credits do you get?',
    creditsprof:'How many credits do you get?',
    frequensType: 'Pick type of frequency...',
    otherFrequensType: 'eg. flexible, on demand etc.',
    hours: 'How many hours in the education?',
    certificates:'What diploma do you get?',
    price: 'eg. 30 000',
    city:'Location of the education (city)',
    start:'dd/mm/yyyy',
    date: 'day Month, year',
    end:'dd/mm/yyyy',
    teacher:'Name of teacher',
    teacherBio:'Description of the teacher',
    contactPerson:'Contact person for the education',
    contactEmail:'e.g. contact@email.com',
    url:'http://www.website.com/education/course1',
  },
  offer : {
    frontTitle:'FRONT TITLE',
    frontText:'Front text',
    partnerTitle: 'PARTNER TITLE',
  },
  request : {
    activeHeader: 'Active inquiries',
    archivedHeader: 'Archived inquiries',
    startdate: 'Starting date',
    type: 'What are you looking for?',
    popup: 'request for quotation',
    sendCopy: 'I would like to receive a copy on my email regarding this requested quotation.',
    extraMessage: (name) => `When you request an quotation from ${name}, we will share the contact information below.`,
    button: 'Request quotation',
    message: 'Your message to the course provider',
    description: 'Description',
    addDesc: 'Can\'t find the education you\'re looking for? Create an inquiry with your needs.',
    editDesc: 'Here you can edit this inquiry.',
    category: 'Category',
    place: 'Desired place for education',
    start: 'Earliest date to start',
    end: 'Latest date to end',
    studyPace: 'Desired study pace',
    contactName:'Name of contact person',
    contactMail:'E-mail of contact person',
    contactPhone:'Telephone number of contact person',
    targets: {
      [fields.inquiryTarget.coaching]: 'Coaching',
      [fields.inquiryTarget.education]: 'Education',
    },
    title: 'Title',
    listTitle: 'Latest inquiries',
    listAllButton: 'All inquiries',
    placeholders : {
      type:'Typ of inquiry...',
      description: 'Describe your inquiry...',
      category: 'Choose a category...',
      place: 'eg. Umeå',
      start:'Choose',
      end:'Choose',
      studyPace:'Choose desired studypace',
      contactName:'eg. Mia Jonsson',
      contactMail:'eg. name.lastname@company.se',
      contactPhone:'eg. 0700080200',
      title: 'Enter the title of the inquiry here'
    },
    deletePopup: {
      title: 'Delete or archive ', //END WITH A SPACE!
      message: 'Are you sure you want to delete this inquiry? If you archive the inquiry it will remain in an "inactive" state',
      button: {
        remove: 'Delete',
        archive: 'Archive',
        cancel: 'Cancel',
      }
    }
  },
  footer : {
    title: 'Footer title',
    description: 'Footer description',
    moreInfo: 'more information',
    cookies: 'Cookies',
    faq: 'FAQ',
    contact: 'Contact us',
    privacy: 'Privacy',
    web: 'www.example.com',
    email: 'info@example.com',
    phone: '010-00 00 000',
  },
  privacy : {
    heading: 'Privacy',
  },
  
  contact : {
    heading: 'Contact us',
  },

  cookies : {
    heading: 'Cookies',
  },
  account : {
    companyAccount: 'Organization Account',
    userAccount: 'Users',
    deleteButton: 'Remove a user',
    addButton: 'Add a user',
    editButton: 'Edit account',
    passwordButton: 'Change password',
    contactAdminButton: 'Contact account admin',
    admins: 'Admins',
    users: 'Users',
    address: 'address',
    contactInfo: 'Contact information',
    contactPerson: 'Contact person',
    header: 'My Account',
    admin: 'Admin account for organisations',
    member: 'Member account for organisations',
    connectedTo: 'Your account is connected to',
    usageAlternatives: [
      'Search educations',
      'Offer educations',
      'Search and offer educations'
    ],
    yrkesakademin: 'Higher Vocational Education',
    popup: {
      title: "Edit your organisation's information",
      disclaimer: 'The changes you make here will affect all company information displayed on this page, for all user accounts connected to this companies organisation number.',
      orgName: "Your organisation's name",
      homepage: "Link to your organisation's homepage",
      description: 'A short discription about your organisation',
      address: "Your organisation's address",
      imageUpload: 'Upload your organisations logo. Supported file format: JPG, JPEG, PNG', 
      email: "Your organisation's email address",
      phonenumber: "Your organisation's phonenumber",
      buttonSave: 'Save',
      buttonCancel: 'Cancel',
      placeholders: {
        orgName: "eg. Company Nation AB",
        homepage: "www.company-nation.se",
        description: "Company is focussed on...",
        address: "Streetname 56, 68292, City, Country",
        email: "info@company-nation.se",
        phonenumber: '0046829826829'
      },
    },
  },
  faq: englishFaq,
  releasenotes: englishReleasenotes,

  about: {
    aboutLink: 'About',
    pageTitle: 'About this page',
    about: 'This is an example site',
    aboutText: 'About text',
    mission: 'What we want',
    missionText: 'Mission text',
    aboutText: 'Some info about this site',
    background: 'Background',
    backgroundText: 'Text describing the background for the web site',
    opensource: 'Open source',
    opensourceText: 'The code for the plattform is open source and can be found on ',
    license: 'License',
    licenseText: 'The licence for the code is ',
  },
  categories: {
    all: 'All categories',
    [fields.categories.ai.slug]: 'Artificial Intelligence',
    [fields.categories.economy.slug]: 'Economy & Trade',
    [fields.categories.leadership.slug]: 'Leadership',
    [fields.categories.transport.slug]: 'Transport & logistics',
    [fields.categories.digitization.slug]: 'Digitization',
    [fields.categories.environment.slug]: 'Environment & Sustainability', 
    [fields.categories.it.slug]: 'Data & IT',
    [fields.categories.design.slug]: 'Design & Media',
    [fields.categories.electrification.slug]: 'Electrification',
    [fields.categories.marketing.slug]: 'Marketing & Communication',
    [fields.categories.hr.slug]: 'HR & Personnel',
    [fields.categories.materials.slug]: 'Materials, Construction & manufacturing',
    [fields.categories.health.slug]: 'Health & care',
    [fields.categories.film.slug]: 'Film & TV-production',
  },
  languages: {
    [fields.languages.swedish.slug]: 'Swedish',
    [fields.languages.english.slug]: 'English',
  },
  overview: {
    activeCourses: 'Active courses',
    archivedCourses: 'Archived courses',
    status: 'status',
    quotationRequests: 'quotation requests',
    startDate: 'starting date',
    lastChanged: 'Modified date',
    lastChangedBy: (date, name) =>  `Last changed ${date}`,
    organizations: 'Organizations',
    edit: 'Edit',
    duplicate: 'Create copy (draft)',
    reassign: 'Change owner',
    remove: 'Remove',
  },
  popup: {
    OrgReminderPopup: {
      title: "Please fill in your organisation's information",
      message: "You haven't completed filling in the information for your organisation. In order to use this service you are required to at least upload a logo.",
      button: "Take me to my organisation's account",
    },
    AddEducationOwnerPopup: {
      title: 'Add another owner for the course:',
      owner: 'Current owner',
      cancel: 'Cancel',
      save: 'Save',
    },
    ConfirmCoursePopup: {
      titlePublished: 'Your course is published!',
      titleNotPublished: 'Your course has been saved!',
      overview: 'Go to overview',
      create: 'Create new course',
    }
  },
  forbidden: {
    title: 'Restricted access',
    info: 'This page is restricted to users only. Please login or create an account to see the content.'
  }
}

