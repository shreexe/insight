import { useContext, useEffect, useState } from 'react';
import InputField from '../components/input-field';
import Layout from '../containers/Layout';
import { UserContext } from '../contexts/user/user.provider';
import { getSummary } from './api/chatgpt';
import  {useRouter} from 'next/router';
import { GET_POSTS_URL, POST_POSTS_URL } from '../helpers/constants';
import { toast } from 'react-hot-toast';
import LinkWithPreview from '../components/link-with-preview';
import Flyout from '../components/flyout';
import Head from 'next/head';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";


export default function Home() {
  const [url, setUrl] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [linkList, setLinkList] = useState([]);
  const {user, setUser} = useContext(UserContext);
  const router = useRouter();  
  const [showFlyout, setShowFlyout] = useState(false)
  const [content, setContent] = useState("")

  useEffect(() => {
    if(user !== null){
      setIsLoading(true)
      getLinks();
    } else {
      setLinkList([])
    }
  }, [user])
  

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("authUser"))
    if(userDetails !== null){
      setUser(userDetails)
    }
  }, [])

  useEffect(() => {
    function checkUserData() {
      const userDetails = JSON.parse(localStorage.getItem("authUser"))
      if(userDetails !== null){
        setUser(userDetails)
      }
    }
  
    window.addEventListener('storage', checkUserData)
  
    return () => {
      window.removeEventListener('storage', checkUserData)
    }
  }, [])
  
  const getLinks = async () => {
    if(user.token === undefined)
      return;

    await fetch(GET_POSTS_URL, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    }).then( res => res.json()
    ).then( data => {
      console.log(data)
      if(data.code !== undefined && data.code === "ERROR_CODE_UNAUTHORIZED" && data.message !== undefined && data.message === "The token expired."){
        setLinkList([])
        setUser(null)
        localStorage.removeItem("authUser")
      } else{
        setLinkList(data)
      }
      setIsLoading(false)
    }).catch(err => {
      alert(err)
      setIsLoading(false)
    })
  }

  const summarize = async () => {
    try {
      // Check if the URL starts with http:// or https://
      const isValidUrl = /^(http|https):\/\/[^ "]+$/.test(url);

      if (isValidUrl) {
        const response = await fetch('/api/summary', {
          method: 'POST',
          body: JSON.stringify({ url }),
        }).then(res => res.json()
        ).then( async (data) => {
          console.log(data)
          // Save the result in the database
          await fetch(POST_POSTS_URL, {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({ 
              // user_id: user.email, // TODO: use a valid user_id 
              link: url,
              summary: data.summary,
              sent_status: false, // check this attribute, what's use, how it should be used
              }),
            }
          ).then( res => res.json()
          ).then( data => {
            console.log(data);
            setLinkList(prev=>([...prev, data]))
            setUrl('')
            setIsLoading(false);
          }
          ).catch(err => alert(err))
        }
        )
      } else {
        toast.error('Invalid URL. Please enter a valid URL that starts with http:// or https://');
        return false;
      }
      // TODO: need to discuss the use of this code, as there is no such endpoint
      // const xanoEndpoint = '';
      // const xanoResponse = await fetch(xanoEndpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     link: url,
      //     summary: summary
      //   }),
      // });
      
    } catch (error) {
      toast.error('An error occurred.');
      return false;
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setShowResult(true);
      }, 1000);
      return true;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(user !== null){
      summarize()
    } else{
      setIsLoading(false)
      toast.error("Please login")
    }
  };

  return (
    <Layout>
      <Head>
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <title key="title">Insight</title>
        <meta
            key="description"
            name="description"
            content="Save links and summary. Always keep the important things in-sight."
        />
        <meta
            key="og:type"
            name="og:type"
            content="website"
        />
        <meta
            key="og:title"
            name="og:title"
            content="Insight"
        />
        <meta
            key="og:description"
            name="og:description"
            content="Save links and summary. Always keep the important things in-sight."
        />
        <meta
            key="og:url"
            name="og:url"
            content="https://insight-next-xi.vercel.app/"
        />
        <meta
            key="og:image"
            name="og:image"
            content='' //TODO: add a banner
        />
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={`@${SOCIAL_HANDLE}`} />
        <meta name="twitter:title" content={MY_SEO.home.title} />
        <meta
            name="twitter:description"
            content={MY_SEO.home.description}
        />
        <meta
            name="twitter:image"
            content={MY_SEO.home.openGraph.image}
        /> */}
      </Head>
    
      <div className={`w-full h-fit ${(linkList.length > 0)?'mt-[80px]':'mt-[50vh] -translate-y-1/2'} flex justify-center items-center transition-all duration-300`}>
       
        <InputField 
          url={url} 
          onChange={(e) => setUrl(e.target.value)} 
          isLoading={isLoading} 
          handleSubmit={handleSubmit} 
          showResult={showResult}
        />
      </div>
      <div className={` ${(linkList.length>0)?'flex flex-col':'hidden'} mt-14 w-full h-fit justify-center items-start overflow-y-auto`}>
        <div className='w-full mb-4 py-2 font-medium text-sm text-gray-700'>
          Recently Added Links
        </div>
        <div className='w-full h-fit flex justify-center items-center'>
          <ResponsiveMasonry
            columnsCountBreakPoints={{350: 1, 550: 2, 1024: 3}}
            className='w-11/12 h-fit'
            >
              <Masonry gutter="15px">
                {
                  linkList.map((link, index) => {
                    return (
                      <LinkWithPreview 
                        key={index} 
                        link={link} 
                        onClick={
                          (linkWithMetaData) => {
                            // console.log(linkWithMetaData.link)
                            setContent(linkWithMetaData); 
                            setShowFlyout(true);
                          }
                        }
                      />
                    )
                  })
                }
                {
                  (linkList.length %3 !== 0) &&
                  <>
                  {
                    [...Array(linkList.length % 3 +1)].map(
                        (_, index) => 
                          <div key={index} className='w-[32%]'></div> // dummy block to align the last row elements properly, if there are odd number of links
                        )
                  }
                  </>
                  
                }
              </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
      {
        isLoading && 
        <div className='fixed top-0 left-0 w-screen h-full bg-[rgba(0,0,0,0.9)] flex justify-center items-center z-50'>
          <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span class="sr-only">Loading...</span>
          </div>
        </div>
      }
      
      <Flyout showFlyout={showFlyout} setshowFlyout={setShowFlyout} content={content}/>
      {/* <div className='w-fit h-fit min-w-[200px] min-h-[200px] fixed top-24 right-7 bg-white'>
      {
        (window !== undefined && window !== null) && 
        <GoogleOneTapLogin 
          onError={(error) => console.log(error)} 
          onSuccess={(response) => console.log(response)} 
          googleAccountConfigs={{ client_id: '941256636440-upb0lls0purq0234sikui6k3bml9hhuu.apps.googleusercontent.com'}} 
        />
      }
      </div> */}
    </Layout>
  );
}
