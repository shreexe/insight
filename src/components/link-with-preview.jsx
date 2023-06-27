import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import RightArrow from '../components/atomic/right-arrow';
import CardLoadingSkeleton from './atomic/card-loading-skeleton';

const LinkWithPreview = ({link, onClick}) => {
    const [metaData, setMetaData] = useState(null)
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
    console.log(link)
    fetchMetadata();
    }, [])

    const fetchMetadata = async () => {
        setLoading(true);
        try{
            await fetch(`/api/metadata?url=${encodeURIComponent(link.link)}`
            ).then( res => res.json()
            ).then( data => {
                console.log(JSON.parse(data))
                setMetaData(JSON.parse(data))
                setLoading(false);
            }
            ).catch( err => toast.error(err) )
        } catch(err){
            toast.error(err)
        } finally{
            setLoading(false)
        }
        
    };

    if(loading){
        return (
            <CardLoadingSkeleton/>
        )
    }

    return (
        <div className='w-full h-fit transition-all duration-300'>
            {
                (metaData !== null && metaData !== undefined && metaData.meta !== null && metaData.meta !== undefined && !loading)?
                <div className='w-full h-fit p-4 rounded-md text-gray-700 flex flex-col justify-between items-center bg-gray-100 cursor-pointer transition-all duration-300 hover:text-gray-800 hover:border-gray-800'>
                    {
                        (metaData.images !== undefined && metaData.images[0] !== undefined) && 
                        <div
                            onClick={() => onClick({link: link, metaData: metaData})} 
                            className="w-full max-h-40 flex justify-center items-center rounded-md overflow-clip"
                            >
                            <img 
                                src={`${metaData.images[0].src}`} 
                                alt={link.link}
                                className="w-full max-h-40 object-cover rounded-md overflow-hidden"
                            />
                        </div>
                    }
                    <div 
                        onClick={() => onClick({link: link, metaData: metaData})} 
                        className='mt-3 w-full font-semibold'
                        >
                        {metaData.meta.title}
                    </div>
                    <div 
                        className='mt-1 w-full text-sm break-all z-10'
                        onClick={()=>{}} // To not to trigger the original onClick function
                        >
                            {   
                                (metaData.meta.url !== null &&  metaData.meta.url !== undefined)?
                                    <a 
                                        href={metaData.meta.url} 
                                        target="_blank"
                                        className="mt-4 text-xs text-blue-500 underline underline-offset-2 cursor-pointer"
                                        >
                                        {metaData.meta.url}
                                    </a>
                                :
                                (metaData.og.url !== null && metaData.og.url !== undefined)?
                                    <a 
                                        href={metaData.og.url} 
                                        target="_blank"
                                        className="mt-4 text-xs text-blue-500 underline underline-offset-2 cursor-pointer"
                                        >
                                        {metaData.og.url}
                                    </a>
                                    :
                                    <></>
                            }
                    </div>
                </div>
                :
                <div className='w-full h-fit p-4 rounded-md text-gray-700 flex flex-col justify-between items-center bg-gray-100 cursor-pointer transition-all duration-300 hover:text-gray-800 hover:border-gray-800 hover:pr-3'>
                    <div onClick={onClick} className='mt-3 w-full font-semibold break-all'>
                        {link.link.substring(link.link.indexOf("/")+2, link.link.lastIndexOf(".")+4)}
                    </div>
                    <div className='flex w-full pr-3 justify-between items-center transition-all duration-300'>
                        <div 
                            className='mt-3 mr-2 w-9/12 text-sm break-all'
                            onClick={()=>{}} // To not to trigger the original onClick function
                        >
                            <a 
                                href={link.link}
                                target="_blank"
                                className="mt-4 text-xs text-blue-500 underline underline-offset-2 cursor-pointer"
                                >
                                {link.link}
                            </a>
                        </div>
                        <div onClick={onClick} className='float-right cursor-pointer'>
                            <RightArrow className={''}/>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default LinkWithPreview