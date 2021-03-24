import React, { useEffect, useState } from 'react';
import styles from '../styles/result.module.css';
import Layout from '../components/Layout';
import Desc from '../components/result/Desc';
import Title from '../components/result/Title';
import Pair from '../components/result/Pair';
import Recommend from '../components/result/Recommend';
import Header from '../components/Header';
import Image from '../components/Image';
import { useRouter } from 'next/router';
import axios from 'axios';
import Chat from '../components/result/Chat';
import Share from '../components/Share';

type mbtiResult = {
    type: string,
    desc: string,
    name: string,
    img: '',
    lovers: [{
        name: '',
        img: ''
    }],
    haters: [{
        name: '',
        img: ''
    }],
    products: [{
        id: 0,
        imgPath1: '',
        goodsDetailUrl: '',
        uspDesc: '',
        goodsNm: ''
    }],
    count: 0,
    total: 0
}

//  검사 결과
function result() {
    //카카오 공유를 위한 script 추가
    useEffect(()=> {
        const script = document.createElement('script')
        script.src= 'https://developers.kakao.com/sdk/js/kakao.js'
        script.async =true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const router = useRouter();
    const [constructorHasRun, setConstructorHasRun] = useState(false);
    let MBTI = router.query;
    
    const mbtiname = router.asPath.slice(8,12);
    
    if(Object.keys(MBTI).length == 0) {
        MBTI = {IE:'0',SN:'0',TF:'0',JP:'0'};
        if(mbtiname[0] == 'I') {
            MBTI["IE"] = '1';
        } else {
            MBTI["IE"] = '-1';
        }
        if(mbtiname[1] == 'I') {
            MBTI["SN"] = '1';
        } else {
            MBTI["SN"] = '-1';
        }
        if(mbtiname[2] == 'I') {
            MBTI["TF"] = '1';
        } else {
            MBTI["TF"] = '-1';
        }
        if(mbtiname[3] == 'I') {
            MBTI["JP"] = '1';
        } else {
            MBTI["JP"] = '-1';
        }
    }
    const score = [];
    let i = 0;
    for(const [key, value] of Object.entries(MBTI)) {
        score[i++] = Number(value);
    }

    const [mbtiResult, setMBTI] = useState<mbtiResult>({
        type: '',
        desc: '',
        name: '',
        img: '',
        lovers: [{
            name: '',
            img: ''
        }],
        haters: [{
            name: '',
            img: ''
        }],
        products: [{
            id: 0,
            imgPath1: '',
            goodsDetailUrl: '',
            uspDesc: '',
            goodsNm: ''
        }],
        count: 0,
        total: 0
    });

    //  survey에서 보낸 mbti 일치하는 유형 받아옴
    const constructor = () => {
        if (constructorHasRun) return;
        axios.get(`${process.env.NEXT_PUBLIC_MBTI_API}/test`, {
            params: {
                IE: score[0],
                SN: score[1],
                TF: score[2],
                JP: score[3],
            }
        })
        .then((res) => {
            console.log(res.data)
            setMBTI(res.data);
        })
        .catch((err) => { console.log(err) });
        setConstructorHasRun(true);
    };
    if((Object.keys(MBTI).length > 0))
        constructor();

    //  유형에 맞는 설명 split
    const description = mbtiResult.desc.split("|");
    const descriptions = description.map((str, idx) => <Desc desc={str} key={idx} />);
    const ratio = Math.ceil((mbtiResult.count / mbtiResult.total)*100);

    const [isChat, setChat] = useState<Boolean>(false);

    const closeChat = () => {
        setChat(false);
    };

    const openChat = () => {
        setChat(true);
    };

    return (
        <div>
            <Header />
            <Layout pageTitle="Result">
                <div className={styles.wrapper}>
                    <Title name={mbtiResult.name} count={mbtiResult.count} ratio={ratio}/>
                    <Image src={mbtiResult.img} />
                    <ul>
                        {descriptions}
                    </ul>
                    <Pair type="환상" name={mbtiResult.lovers[0].name} src={mbtiResult.lovers[0].img} />
                    <Pair type="환장" name={mbtiResult.haters[0].name} src={mbtiResult.haters[0].img} />
                    <div className={styles.recommend}>
                        <Recommend name={mbtiResult.name} products={mbtiResult.products} />
                    </div>

                    {!isChat && <div className={styles.btnWrapper}>
                        <button className={styles.chatBtn} onClick={openChat}>
                            {mbtiResult.name}끼리 채팅하기
                        </button>
                    </div>}
                    {isChat && <Chat close={closeChat} type={mbtiResult.type} />}
                    <Share/>
                </div>
            </Layout>
        </div>
    );
}

export default result