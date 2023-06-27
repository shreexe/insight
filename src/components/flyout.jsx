import FlyoutHeader from './flyout-header'

const Flyout = ({showFlyout, setshowFlyout, content}) => {
  const {link, metaData} = content;

  // console.log(link, metaData)
  return (
    <div className={`${(showFlyout)?'opacity-1 duration-100':'opacity-0 pointer-events-none duration-100 delay-500'} transition-all  ease-in-out w-screen h-full fixed top-0 left-0 z-50`}>
        <div 
          onClick={()=>setshowFlyout(false)}
          className={`absolute left-0 h-full ${(showFlyout)?'w-2/5 bg-[rgba(0,0,0,0.3)] delay-100 duration-500':'w-full bg-transparent duration-500'} transition-all `}
          >
        </div>
        <div
          onClick={()=>{}} // donot close the flyout
          className={`${(showFlyout)?'right-0 delay-100 duration-500':'-right-full duration-500'} w-full sm:w-3/5 h-full absolute bg-white text-gray-900 transition-all  ease-in-out border-l-[1px] border-solid border-l-[rgba(255,255,255,0.3)]`}>
            <div className='w-full h-full relative'>
                <FlyoutHeader setshowFlyout={setshowFlyout}/>
                {
                  ( metaData !== undefined && link !== undefined) &&
                  <div className='w-full h-[90%] p-4 sm:px-10 overflow-y-auto text-gray-900'>
                    {
                      (metaData.images !== undefined && metaData.images[0] !== undefined) &&
                        <div className='my-3 w-full h-fit'>
                          <img
                            src={`${metaData.images[0].src}`}
                            alt={link.link}
                            className='w-full max-h-72 object-cover'
                          />
                        </div>
                    }
                    {
                      ( metaData.meta.title !== null && metaData.meta.title !== undefined) &&
                        <div className='w-full mt-5 mb-1'>
                          <a
                            href={`${link.link}`}
                            target='_blank'
                            className='text-xl font-semibold text-gray-800'>
                            {metaData.meta.title}
                          </a>
                        </div>
                    }
                    {
                      (metaData.og.site_name !== null && metaData.og.site_name !== undefined) &&
                        <div className='mt-1 mb-3 text-sm font-medium text-gray-500'>
                          {metaData.og.site_name}
                        </div>
                    }

                    <div className='mt-5 mb-2 text-lg font-semibold'> Summary </div>
                    <div className='text-gray-600 text-justify'>
                      {link.summary}
                    </div>
                  </div>
                }
            </div>
        </div>
    </div>
  )
}

export default Flyout