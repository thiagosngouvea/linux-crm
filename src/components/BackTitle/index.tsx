import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from 'next/router';

interface BackTitleProps {
    title: string;
    push?: string;
}



const BackTitle = React.memo(function BackTitle({title, push}: BackTitleProps) {

    const router = useRouter();
    return (
        <div className="flex mb-8">
            <IoArrowBack 
                className="text-2xl text-orange-400 cursor-pointer hover:text-orange-600"
                onClick={() => {
                    if(push){
                        router.push(push);
                    } else {
                        router.back();
                    }
                }}    
            />
            <h3 className="flex text-2xl font-bold text-orange-400 justify-center w-full">{title}</h3>
        </div>
    )

});

export default BackTitle;