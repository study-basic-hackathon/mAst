import React, { useState } from 'react'
import { FaImage } from "react-icons/fa";

export interface CardBaseProps {
  title: string;
  category: string;
  imageUrl?: string;
};

{/* ベースのコンポーネントには子コンポーネントの実装を強制する */}
interface NeedChildren {
  children: React.ReactNode;
};

const CardBase : React.FC<CardBaseProps & NeedChildren> = ({title='', category='', imageUrl='', children}) => {
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
    };

    const ErrorImage = () => {
        return (
            <div style={{display: 'flex', justifyContent:'center', alignItems:'center', height:'100%', width: '100%', backgroundColor:'#d1d1d1'}}>
                <FaImage size={'60%'}/>
            </div>
        );
    }

    const validUrl = (imgUrl:string) => {
        if(imgUrl === '') return false;
        if(hasError) return false;
        return true;
    }

    return (
        <div style={{display:'flex', width: '100%', height:'90px', marginBottom:'10px'}}>
            <div className='cardWrapper' style={{display:'flex', overflow: 'hidden', width: '100%', height:'100%', margin:'5px', borderRadius:'5px', border:'1px solid', borderColor: 'gray'}}>
                <div className='cardImage' style={{justifyContent:'center', alignItems:'center', height:'100%', aspectRatio:'1/1'}}>
                    { validUrl(imageUrl) ? <img src={imageUrl} onError={() => handleError()}></img> : <ErrorImage /> }
                </div>

                <div className='cardText' style={{flexGrow:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'5px 10px'}}>
                    <p style={{fontSize:'23px', fontWeight:'bold', margin:0, lineHeight:'1.2'}}>{title}</p>
                    <p style={{fontSize:'16px', margin:0, lineHeight:'1.2'}}>{category}</p>
                </div>

                <div className='cardContent' style={{alignItems:'flex-end', width:'30%'}}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export {CardBase};
