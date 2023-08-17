import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import SectionWrapper from './SectionWrapper'
import { CheckboxInput, Form } from '../educate/FormInputs'
import { jobsearchSearch, taxonomyGraphql, jobadEnrichTextDocuments } from '../../util/arbetsformedlingen'


const Future = () => {

  const { strings } = useContext(LanguageContext)
  const { cvCompetences } = useContext(GuidanceContext)
  const { skills } = useContext(GuidanceContext)
  const { occupations } = useContext(GuidanceContext)
  const { occupationGroups } = useContext(GuidanceContext)
  const { occupationFields } = useContext(GuidanceContext)
  const history = useHistory()
  const [ads, setAds] = useState([])
  const [useOcc, setUseOcc] = useState(false)
  const [useOccGroups, setUseOccGroups] = useState(true)
  const [useOccFields, setUseOccFields] = useState(false)
  const [useSkills, setUseSkills] = useState(false)
  const [useComp, setUseComp] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({})
  const returnNumAds = 25
  const [totalMatchedAds, setTotalMatchedAds] = useState(0)

  useEffect(() => {
    const fetchAds = async () => {
      let jobsearchData = await jobsearchSearch(
        (useOcc ? Object.entries(occupations).filter(([key, x], index) => x.vagledning_active).map(([key, x], index) => (x.vagledning_active ? x.concept_taxonomy_id : '')) : []),
        (useOccGroups ? Object.entries(occupationGroups).filter(([key, x], index) => x.vagledning_active).map(([key, x], index) => (x.vagledning_active ? x.concept_taxonomy_id : '')) : []),
        (useOccFields ? Object.entries(occupationFields).filter(([key, x], index) => x.vagledning_active).map(([key, x], index) => (x.vagledning_active ? x.concept_taxonomy_id : '')) : []),
        (useSkills ? Object.entries(skills).filter(([key, x], index) => x.vagledning_active).map(([key, x], index) => (x.vagledning_active ? x.concept_taxonomy_id : '')) : []),
        (useComp ? Object.entries(cvCompetences).filter(([key, x], index) => x.vagledning_active).map(([key, x], index) => (x.vagledning_active ? x.term : '')) : []),
        returnNumAds
      );
      setTotalMatchedAds(jobsearchData.total.value)
      setAds(jobsearchData.hits.map(x => {
            return {
              "id": x.id,
              "webpage_url": x.webpage_url,
              "headline": x.headline,
              "description": x.description,
              "occupation": x.occupation,
              "occupation_group": x.occupation_group,
              "occupation_field": x.occupation_field,
              "workplace_address": x.workplace_address,
              "employer": x.employer,
              "vagledning_active": false,
              "must_have_skills": x.must_have.skills,
              "nice_to_have_skills": x.nice_to_have.skills,
              "ssyk_related_skills": [],
              "enrichment_competencies": []
            }
          }
        )
      )
    }
    fetchAds();
  }, [useOcc, useOccGroups, useOccFields, useSkills, useComp]);

  const handleUseOcc = (event) => {setUseOcc(event.target.checked)};
  const handleUseOccGroups = (event) => {setUseOccGroups(event.target.checked)};
  const handleUseOccFields = (event) => {setUseOccFields(event.target.checked)};
  const handleUseSkills = (event) => {setUseSkills(event.target.checked)};
  const handleUseComp = (event) => {setUseComp(event.target.checked)};

  const adExpandHandler = (event) => {
    const currentIndex = ads.findIndex((ads) => ads.id === event.target.id);
    const updatedAd = Object.assign({}, ads[currentIndex]);
    console.log(updatedAd)
    updatedAd.vagledning_active = !updatedAd.vagledning_active;

    const fetchExpansionData = async () => {
      // Get ssyk-level-4 related skills
      const taxData = await taxonomyGraphql("query MyQuery{concepts(id:\"" + event.target.getAttribute('data-ssyk4-id') + "\"){id preferred_label type related(type:\"skill\",limit:2){id type preferred_label}}}", '', '');
      updatedAd.ssyk_related_skills = taxData.data.concepts[0].related.map(s => {
          return {
            "label": s.preferred_label,
            "concept_taxonomy_id": s.id,
            "vagledning_active": false
          }
        }
      )

      const jobadData = await jobadEnrichTextDocuments('', updatedAd.description.text);
      console.log(jobadData)
      updatedAd.enrichment_competencies = jobadData[0].enriched_candidates.competencies.map(c => {
          return {
            "label": c.concept_label,
            "concept_taxonomy_id": '',
            "term": c.term,
            "prediction": c.prediction,
            "vagledning_active": true
          }
        }
      )

      const newAds = ads.slice();
      newAds[currentIndex] = updatedAd;
      console.log(newAds[currentIndex].ssyk_related_skills)
      setAds(newAds);
    }
    fetchExpansionData();
  }

  const ExpandedData = (ad, index) => {
    return (
      <div>
        <i>Employment:</i>
        <div className='employment'>
          <ul>
              <li key="1">- occupation: {ad.occupation.label}</li>
              <li key="2">- occupation_group: {ad.occupation_group.label}</li>
              <li key="3">- occupation_field: {ad.occupation_field.label}</li>
              <li key="4">- {ad.webpage_url}</li>
          </ul>
        </div>
        <i>Workplace:</i>
        <div className='workplace'>
          <ul>
              <li key="1">- {ad.employer.name}</li>
              <li key="2">- {ad.workplace_address.municipality}</li>
          </ul>
        </div>
        <i>ssyk related skills:</i>
        <div className='occ related skills'>
          <ul>
            {ad.ssyk_related_skills.map((skill, index) => (
              <li key={index}>- {skill.label}</li>
            ))}
          </ul>
        </div>
        <i>ad enrichment competencies:</i>
        <div className='ad enrichment competencies'>
          <ul>
            {ad.enrichment_competencies.map((competence, index) => (
              <li key={index}>- {competence.label}</li>
            ))}
          </ul>
        </div>
        <i>cv enrichment competencies:</i>
        <div className='cv enrichment competencies'>
          <ul>
            {Object.entries(cvCompetences).map(([key, competence], index) => {
              return <li key={index}>- {competence.label}</li>
            })}
          </ul>
        </div>
      </div>
    )
  }

  const handleSubmit = (evt) => {
    console.log('handleSubmit')
    // To Be Continued ...
    history.push('/vagledning')
  }

  return (
    <div>
      <SectionWrapper>
        <h2 id='heading-mod'>{strings.vagledning.future.Header}</h2>
        <p dangerouslySetInnerHTML={{__html: strings.vagledning.future.Preamble}} />
      </SectionWrapper>

      <div className='vagledning-start'>
        <Form formData={formData} setFormData={setFormData} errors={errors} className='register-user' onSubmit={handleSubmit}>
          <div>

            <h3>Sökparametrar</h3>
            <div key='1' className='cat-title'>
              <CheckboxInput id='1' checked={useOcc} onChange={handleUseOcc} text='Occupations' />
              <CheckboxInput id='2' checked={useOccGroups} onChange={handleUseOccGroups} text='Occupation Groups' />
              <CheckboxInput id='3' checked={useOccFields} onChange={handleUseOccFields} text='Occupation Fields' />
              <CheckboxInput id='4' checked={useSkills} onChange={handleUseSkills} text='Skills' />
              <CheckboxInput id='5' checked={useComp} onChange={handleUseComp} text='Competences' />
            </div>

            <h3>{strings.vagledning.future.ads} (JobSearch) {ads.length}/{totalMatchedAds} st</h3>
            {ads.map((ad, index) => (
              <div key={index} className='cat-title'>
                <CheckboxInput id={ad.id} data-ssyk4-id={ad.occupation_group.concept_id} checked={ad.vagledning_active} onChange={adExpandHandler} text={ad.headline} />
                {ad.vagledning_active ? ExpandedData(ad, index) : <i></i>}
              </div>
            ))}

          </div>    
          <button className='button'>{strings.vagledning.cv.next}</button>
        </Form>
      </div>
    </div>
  )
}

export default Future