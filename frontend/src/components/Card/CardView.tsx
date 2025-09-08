import React from 'react'
import { CardBase, CardBaseProps } from './CardBase';

interface CardViewProps extends CardBaseProps {
  quantity?:number;
};

const CardView : React.FC<CardViewProps> = ({title='', category='', imageUrl='', quantity=0}: CardViewProps) => {
    const ViewQuantity = (quantity: number) => {
        return (
            <div style={{display:'flex', height:'100%', width:'100%', justifyContent:'right', alignItems:'center'}}>
                <p style={{textAlign:'right', fontSize:'25px', fontWeight:'bold', lineHeight:'1.2', margin:0, paddingRight:'10px'}}>{quantity} 個</p>
            </div>
        )
    };

    return (
        <CardBase title={title} category={category} imageUrl={imageUrl} >
            {ViewQuantity(quantity)}
        </CardBase>
    );
};

export default CardView;

