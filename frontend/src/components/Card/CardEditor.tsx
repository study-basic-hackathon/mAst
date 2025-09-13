import React, { useState, useRef, ChangeEvent } from 'react'
import { CardBase, CardBaseProps } from './CardBase';
import { FaPlusCircle, FaMinusCircle, FaMinusSquare } from "react-icons/fa";
import { ActionFunction } from 'react-router-dom';

interface CardEditorProps extends CardBaseProps {
  quantity:number
  handleDeleteClick:ActionFunction;
};

const CardEditor : React.FC<CardEditorProps> = ({title='', category='', imageUrl='', quantity:init_quantity, handleDeleteClick}: CardEditorProps) => {
    const [quantity, setQuantity] = useState(init_quantity);

    const OnQuantityChanged = (quantity:number) => {
        if(quantity < 0) setQuantity(0);
        else setQuantity(quantity);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if(!isNaN(Number(newValue))) {
            OnQuantityChanged(Number(newValue));
        }
    };

    const QuantitySelector = () => {
        var temp:number = quantity;

        return (
            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <div style={{display:'flex', flexDirection:'row', height:'50%', width:'160px', border:'1px solid', borderRadius:'10px', borderColor:'gray', marginRight:'5px'}}>
                    <button onClick={()=>OnQuantityChanged(temp-1)} style={{width:'25%', padding:0, marginRight:'5px'}} ><FaMinusCircle size='60%'/></button>
                    <input className='quantityText' value={temp} onChange={handleChange} type="text" style={{fontSize:'25px', fontWeight:'bold', textAlign:'right', width:'40%', marginTop:'10px', marginBottom:'10px'}}/>
                    <button onClick={()=>OnQuantityChanged(temp+1)} style={{width:'25%', padding:0, marginLeft:'5px'}} ><FaPlusCircle size='60%'/></button>
                </div>
                <p style={{width:'auto', fontSize:'25px', fontWeight:'bold'}}>個</p>
            </div>
        );
    };

    const DeleteButton = () => {
        return (
            <button style={{height:'100%', padding:0}}>
                <FaMinusSquare size={'60%'} color={'#ff6464'} onClick={()=> handleDeleteClick} />
            </button>
        );
    };

    const ItemEditor = () => {
        return (
            <div style={{height:'100%', display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                <div style={{alignContent:'right'}}>
                    <QuantitySelector/>
                </div>
                <div style={{width:'50px'}}>
                    <DeleteButton />
                </div>
            </div>
        );
    };

    return (
        <CardBase title={title} category={category} imageUrl={imageUrl} >
            <ItemEditor/>
        </CardBase>
    );
};

export default CardEditor;