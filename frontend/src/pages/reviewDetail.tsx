import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import MenuIcon from 'mdi-react/MenuIcon';
import styles from '../styles/reviewDetail.module.css';
import Router, { useRouter } from 'next/router';
import DeleteIcon from 'mdi-react/TrashCanOutlineIcon';
import UpdateIcon from 'mdi-react/EditOutlineIcon';
import Alert from '../components/Alert';
import Menu from '../components/review/List/Menu';
import Cmt from '../components/review/Detail/comment';
import Login from '../components/review/List/Login';

function reviewDetail() {
    const router = useRouter();
    const no = router.query.no;
    const [constructorHasRun, setConstructorHasRun] = useState(false);

    type review = {
        no: number,
        title: string,
        author: string,
        img: [string],
        content: [string],
        time: string
    }

    const [reviewDetail, setDetail] = useState<review>({
        no: 0,
        title: '',
        author: '',
        img: [''],
        content: [''],
        time: ''
    });

    const constructor = () => {
        if (constructorHasRun) return;
        axios.get(`${process.env.NEXT_PUBLIC_API}/review/detail/${no}`)
        .then((res) => {
            // console.log(res.data);
            let data = res.data;
            data.content = data.content.split(process.env.NEXT_PUBLIC_SEPARATOR);
            setDetail(data);
        })
        .catch((err) => { console.log(err) });
        setConstructorHasRun(true);
    }
    if(no != undefined)
        constructor();

    const content = reviewDetail.content.map((str, idx) =>
        <div key={idx} className={styles.contentArea}>
            <div dangerouslySetInnerHTML={{ __html: str }}
                className={styles.content}></div>
            <div className={styles.imgWrapper}>
                <img src={reviewDetail.img[idx]} width="200" alt=""
                    className={styles.img}/>
            </div>
        </div>
    )

    const showAlert = (str: string) => {
        setContent(str);
        setAlert(true);
    }

    const [isAlert, setAlert] = useState<Boolean>(false);

    const closeAlert = () => {
        setAlert(false);
        moveToList();
    };

    const moveToList = () => {
        Router.push({
            pathname: '/reviewList',
            query: { page: 1 }
        });
    }

    const deleteReview = () => {
        axios.delete(`${process.env.NEXT_PUBLIC_API}/review/detail/${no}`)
        .then((res) => {
            showAlert('????????? ?????????????????????.');
        })
        .catch((err) => { console.log(err) });
    };

    const [isMenu, setMenu] = useState<Boolean>(false);

    const closeMenu = () => {
        setMenu(false);
    };

    const showMenu = () => {
        setMenu(true);
    };

    const [mdContent, setContent] = useState<string>('');
    const [isLogin, setLogin] = useState<Boolean>(false);
    const openLogin = () => {
        setLogin(true);
    }
    
    const closeLogin = (str: string) => {
        setLogin(false);
        showAlert(str);
    }

    const justCloseLogin = () => {
        setLogin(false);
    }
   
    const [token, setToken] = useState<string>('');
    
    useEffect(() => {
        setToken(localStorage.getItem('token'));
    });
    
    const isToken = token != null ? true : false;

    return (
        <Layout pageTitle="Detail">
            <div className={styles.wrapper}>
                <button className={styles.menuIcon} onClick={showMenu}>
                    <MenuIcon />
                </button>
                <hr className={styles.hr}/>
                <div className={styles.detailArea}>
                    <div className={styles.title}>
                        {reviewDetail.title}
                    </div>
                    <div className={styles.author}>
                        {reviewDetail.author}
                    </div>
                    <div className={styles.time}>
                        {reviewDetail.time}
                    </div>
                    <hr className={styles.hr}/>
                    {content}
                    <hr className={styles.hr}/>
                    {isToken && <div>
                        <button className={styles.detailBtn} onClick={deleteReview}>
                            <DeleteIcon size='20'/>
                        </button>
                        <button className={styles.detailBtn} onClick={() => Router.push({
                            pathname: '/reviewUpdate',
                            query: {
                                no: no
                            }
                        })}>
                            <UpdateIcon size='20'/>
                        </button>
                    </div>}
                </div>

                <Cmt no={no}/>
                <hr className={styles.bottomLine}/>
                <button className={styles.listBtn} onClick={moveToList}>??????</button>
                <Alert content={mdContent} isOpen={isAlert} close={closeAlert}/>
                <Menu isOpen={isMenu} close={closeMenu} token={token} openLogin={openLogin} openAlert={showAlert}/>
                <Login isOpen={isLogin} close={closeLogin} justclose={justCloseLogin}/>
            </div>
        </Layout>
    )
}

export default reviewDetail;