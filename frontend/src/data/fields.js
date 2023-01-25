const record_status = {
	draft: "DRAFT",
	needverification: "NEEDVERIFICATION",
	unapproved: "UNAPPROVED",
	approved: "APPROVED",
	rubbish: "RUBBISH",
	generated: "GENERATED",
	archived: "ARCHIVED",
}


const inquiryTarget = {
  coaching: 0,
  education: 1
}

const category = {
  ai:              0,
  economy:         1,
  leadership:      2,
  transport:       3,
  digitization:    4,
  environment:     5,
  it:              6,
  design:          7,
  electrification: 8,
  marketing:       9,
  hr:             10,
  materials:      11
}

const categories = {
  ai: {
    id: 0, image: 'img/ikon-ai.svg', slug: 'artificiellintelligens'
  },
  economy: {
    id: 1, image: 'img/ikon-economy.svg', slug: 'ekonomi'
  },
  leadership: {
    id: 2, image: 'img/ikon-leadership.svg', slug: 'ledarskap'
  },
  transport: {
    id: 3, image: 'img/ikon-transport.svg', slug: 'transport'
  },
  digitization: {
    id: 4, image: 'img/ikon-digitization.svg', slug: 'digitalisering'
  },
  environment: {
    id: 5, image: 'img/ikon-sustainability.svg', slug: 'miljo'
  },
  it: {
    id: 6, image: 'img/ikon-data-it.svg', slug: 'datait'
  },
  design: {
    id: 7, image: 'img/ikon-design.svg', slug: 'design'
  },
  electrification: {
    id: 8, image: 'img/ikon-electrification.svg', slug: 'elektrifiering'
  },
  marketing: {
    id: 9, image: 'img/ikon-marketing.svg', slug: 'marknadsforing'
  },
  hr: {
    id: 10, image: 'img/ikon-hr.svg', slug: 'personal'
  },
  materials: {
    id: 11, image: 'img/ikon-construction.svg', slug: 'material'
  },
  health: {
    id: 12, image: 'img/ikon-vard-halsa.svg', slug: 'vardochhalsa'
  },
  film: {
    id: 13, image: 'img/ikon-film.svg', slug: 'film'
  },
}

const languages = {
  swedish: {
    id: 0, slug: 'sv'
  },
  english: {
    id: 1, slug: 'en'
  },
}

const import_sources = {
  SUSA_NAVET: {
    id: 0, name: 'SUSA-navet'
  },
  GOTEBORGS_TEKNISKA_COLLEGE: {
    id: 1, slug: 'Göteborgs Tekniska College'
  },
  LEARNING_4_PROFESSIONALS: {
    id: 2, slug: 'Learning 4 Professionals'
  }
}

//For convenience, this can be used to iterate through categories
const categoriesList = Object.values(categories)

export const fields = {
  record_status,
  inquiryTarget,
  category,
  categories,
  categoriesList,
  languages,
  import_sources,
  record_status,
}