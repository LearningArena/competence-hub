import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import BackButton from './BackButton'

const Privacy = () => {
    const {strings} = useContext(LanguageContext)

    return (
        <div className='info-page'>
            <BackButton/>
            <h2>{strings.privacy.header}</h2>
            <div className='content'>
                <div ID={strings.privacy.block1.id} className='content-block'>
                    <h3>{strings.privacy.block1.header}</h3>
                    <p dangerouslySetInnerHTML={{__html : strings.privacy.block1.text}}></p>
                </div>
                <div ID={strings.privacy.block2.id} className='content-block'>
                     <h3>{strings.privacy.block2.header}</h3>
                     <p dangerouslySetInnerHTML={{__html : strings.privacy.block2.text}}></p>
                </div>
                <div ID={strings.privacy.block3.id} className='content-block'>
                     <h3>{strings.privacy.block3.header}</h3>
                    <ul className='bullet-list'>
                        {strings.privacy.block3.list.map((item, index) => (
                             <li dangerouslySetInnerHTML={{__html : item}} ></li>
                        ))}
                    </ul>
                </div>  
                <div ID={strings.privacy.block4.id} className='content-block'>
                     <h3>{strings.privacy.block4.header}</h3>
                     <p dangerouslySetInnerHTML={{__html : strings.privacy.block4.text1}}></p>
                    <ul className='bullet-list'>
                        {strings.privacy.block4.list.map((item, index) => (
                            <li dangerouslySetInnerHTML={{__html : item}} ></li>
                        ))}
                    </ul>
                </div>
                <div ID={strings.privacy.block5.id} className='content-block'>
                     <h3>{strings.privacy.block5.header}</h3>
                     <h4>{strings.privacy.block5.subheader2}</h4>
                     <p dangerouslySetInnerHTML={{__html : strings.privacy.block5.text1}}></p>
                     <h4>{strings.privacy.block5.subheader2}</h4>
                     <p dangerouslySetInnerHTML={{__html : strings.privacy.block5.text2}}></p>
                </div>
                <div ID={strings.privacy.block6.id} className='content-block'>
                     <h3>{strings.privacy.block6.header}</h3>
                     <h4>{strings.privacy.block6.subheader2}</h4>
                     <p dangerouslySetInnerHTML={{__html : strings.privacy.block6.text1}}></p>
                     <h4>{strings.privacy.block6.subheader2}</h4>
                     <p dangerouslySetInnerHTML={{__html : strings.privacy.block6.text2}}></p>
                </div>
            </div>
        </div>
        )
    }
    
    export default Privacy