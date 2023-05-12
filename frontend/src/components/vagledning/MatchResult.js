import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import ProgressTable from '../general/ProgressTable'
import StepHeader from '../general/StepHeader'
import { CheckboxInput, Form } from '../educate/FormInputs'
import { jobsearchSearch, taxonomyGraphql, jobadEnrichTextDocuments } from '../../util/arbetsformedlingen'


const MatchResult = () => {

  const { strings } = useContext(LanguageContext)
  const { competences } = useContext(GuidanceContext)
  const { occupations } = useContext(GuidanceContext)
  const { occupationGroups } = useContext(GuidanceContext)
  const history = useHistory()
  const [ads, setAds] = useState([])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const fetchAds = async () => {
      const jobsearchData = await jobsearchSearch(
        occupations.map(x => x.concept_taxonomy_id),
        occupationGroups.map(x => x.concept_taxonomy_id),
        [],//skills.map(x => x.concept_taxonomy_id),
        'currently unused freetext',
        10
      );
      console.log(jobsearchData)
      setAds(jobsearchData.hits.map(x => {
            return {
              "id": x.id,
              "headline": x.headline,
              "description": x.description,
              "occupation": x.occupation,
              "occupation_group": x.occupation_group,
              "occupation_field": x.occupation_field,
              "workplace_address": x.workplace_address,
              "employer": x.employer,
              "vagledning_active": false,
              "ssyk_related_skills": [],
              "enrichment_competencies": []
            }
          }
        )
      )
    }
    fetchAds();
  }, [occupations]);

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
            {competences.map((competence, index) => (
              <li key={index}>- {competence.label}</li>
            ))}
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
      <h2>{strings.vagledning.cv.pageTitle}</h2>

      <ProgressTable currentStep='3' totalSteps='4' />

      <div className='vagledning-start'>
        <StepHeader currentStep='3' text={strings.vagledning.matchResult.step3Header} />
        <div>
          {strings.vagledning.matchResult.step3Instr}
        </div>

        <Form formData={formData} setFormData={setFormData} errors={errors} className='register-user' onSubmit={handleSubmit}>
          <div>
            <h3>{strings.vagledning.matchResult.ads} (JobSearch)</h3>
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

export default MatchResult
