import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import BackButton from './BackButton'

const Cookies = () => {
    const {strings} = useContext(LanguageContext)

    return (
        <div className='info-page'>
            <BackButton/>
            <h2>{strings.cookies.header}</h2>
            <div className='content'>
                <div ID={strings.cookies.block1.id} className='content-block'>
                    <h3>{strings.cookies.block1.header}</h3>
                    <p dangerouslySetInnerHTML={{__html : strings.cookies.block1.text}}></p>
                </div>
                <div ID={strings.cookies.block2.id} className='content-block'>
                     <h3>{strings.cookies.block2.header}</h3>
                     <p dangerouslySetInnerHTML={{__html : strings.cookies.block2.text}}></p>
                </div>
                <div ID={strings.cookies.block3.id} className='content-block'>
                     <h3>{strings.cookies.block3.header}</h3>
                    <ul className='bullet-list'>
                        {strings.cookies.block3.list.map((item, index) => (
                             <li dangerouslySetInnerHTML={{__html : item}} ></li>
                        ))}
                    </ul>
                </div>  
                <div ID={strings.cookies.block4.id} className='content-block'>
                     <h3>{strings.cookies.block4.header}</h3>
                     <p dangerouslySetInnerHTML={{__html : strings.cookies.block4.text1}}></p>
                    <ul className='bullet-list'>
                        {strings.cookies.block4.list.map((item, index) => (
                            <li dangerouslySetInnerHTML={{__html : item}} ></li>
                        ))}
                    </ul>
                </div>
                <div ID={strings.cookies.block5.id} className='content-block'>
                     <h3>{strings.cookies.block5.header}</h3>
                     <h4>{strings.cookies.block5.subheader2}</h4>
                     <p dangerouslySetInnerHTML={{__html : strings.cookies.block5.text1}}></p>
                     <h4>{strings.cookies.block5.subheader2}</h4>
                     <p dangerouslySetInnerHTML={{__html : strings.cookies.block5.text2}}></p>
                </div>
                <div ID={strings.cookies.block6.id} className='content-block'>
                     <h3>{strings.cookies.block6.header}</h3>
                     <h4>{strings.cookies.block6.subheader2}</h4>
                     <p dangerouslySetInnerHTML={{__html : strings.cookies.block6.text1}}></p>
                     <h4>{strings.cookies.block6.subheader2}</h4>
                     <p dangerouslySetInnerHTML={{__html : strings.cookies.block6.text2}}></p>
                </div>
            </div>
        </div>
        )
    }
    
export default Cookies