'use client';
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios";
import styles from './page.module.css';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import beansZero from "./beansZero.png"
import coinsbanner from './bg.png'
const QUESTIONS = [
    {
        question: "What are Surge Beans and how do they work?",
        answer: " Surge Beans are reward points you earn on orders, subscriptions, and workshop bookings, on every purchase, you earn WM Beans worth 10% of the order value (e.g. AED 1,000 = 100 Beans) and can be used for discounts on eligible purchases."
    },
    {
        question: " where can I use  my Surge Beans?",
        answer: "You can redeem your Beans as 'real money' discounts during checkout. While they are valid for most products, they cannot be redeemed on Subscriptions or Workshops."
    },
    {
        question: "Are there any limits on how many Beans I can use?",
        answer: "Yes, you can redeem Beans up to a specific percentage of your total order value per purchase. This ensures balanced reward usage across all your orders."
    },
    {
        question: "Can I pay the full amount using Beans?",
        answer: "Beans can generally be used alongside other discounts unless stated otherwise. However, they cannot be transferred to other accounts or withdrawn as physical cash; they are strictly for eligible store discounts."
    },
    {
        question: "How do coin expiry and tracking work?",
        answer: "Yes, Beans may have an expiry period. We recommend checking your account dashboard regularly to view your current balance and track validity details."
    }
];
function formatDateParts(isoString) {
    if (!isoString) return { datePart: 'N/A', timePart: '' };
    const d = new Date(isoString);
    const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { datePart, timePart };
}

const WhiteMantisBeans = () => {
    const { data: session } = useSession();
    const [openIndex, setOpenIndex] = useState(null);
    const faqRef = useRef(null);
    const [allTransactions, setAllTransactions] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [totalBalance, setTotalBalance] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchBeans = async () => {
            if (session?.user?.id) {
                try {
                    const response = await axiosClient.get(`/api/user-surge-coins`, {
                        params: {
                            'where[user][equals]': session.user.id,
                            'sort': '-date',
                            'limit': 1,
                            'depth': 1
                        }
                    });

                    const doc = response.data?.docs?.[0] || response.data;
                    setTotalBalance(doc.totalBalance || 0);

                    const earningTransactions = (doc.coinEarningHistory || []).map(item => ({
                        details: item.type === 'offline' ? `Reference Id: ${item.offlineReferenceId}` : `Order Id: ${item.linkedOrder?.value?.id ?? 'N/A'}`,
                        transaction_type: 'Beans Credit',
                        transaction_date: item.earnedAt,
                        expiry_date: item.expiryDate,
                        coins: `+${item.amount}`,
                        _sortDate: new Date(item.earnedAt),
                    }));

                    const redemptionTransactions = (doc.pointsRedemptionHistory || []).map(item => ({
                        details: item.type === 'offline' ? `Reference Id: ${item.offlineReferenceId}` : `Order Id: ${item.associatedOrder?.value?.id ?? 'N/A'}`,
                        transaction_type: 'Beans Redeemed',
                        transaction_date: item.redeemedAt,
                        expiry_date: null,
                        coins: `-${item.redeemedPoints}`,
                        _sortDate: new Date(item.redeemedAt),
                    }));

                    const merged = [...earningTransactions, ...redemptionTransactions]
                        .sort((a, b) => b._sortDate - a._sortDate);

                    setAllTransactions(merged);
                } catch (error) {
                    console.error("BEANS API ERROR:", error.response?.data || error.message);
                }
            }
        };

        fetchBeans();
    }, [session]);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const scrollToFAQ = () => {
        faqRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const displayData = allTransactions.slice(0, visibleCount);
    const hasMore = visibleCount < allTransactions.length;
    const loadMore = () => setVisibleCount(prev => prev + 10);

    return (
        <div className={styles.head}>
            <div className={styles.border}>
                <div className={styles.main}>

                </div>
                <div className={styles.main1}>

                    <div>
                        <div className={styles.rewardsBanner}>
                            <Image
                                src={coinsbanner}
                                alt="Surge Rewards Banner"
                                width={1200}
                                height={200}
                                className={styles.bannerImg}
                                priority
                            />
                            <div className={styles.bannerOverlay}>
                                <div className={styles.balanceWrapper}>
                                    <h2>{totalBalance}</h2>
                                    <p>Surge Beans</p>
                                </div>

                            </div>
                            <p className={styles.validityText}>
                                Surge Beans are valid for 12 months from the date they're earned.
                            </p>
                        </div>

                    </div>


                    <section className={styles.box}>
                        <div className={styles.heading}><h1>How it Works</h1></div>
                        <div className={styles.stepsGrid}>
                            <div className={styles.stepItem}>
                                <div className={styles.iconCircle}>
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1H3.37494L6.5336 15.7484C6.64948 16.2885 6.95001 16.7713 7.38349 17.1138C7.81696 17.4562 8.35626 17.6369 8.90854 17.6246H20.522C21.0625 17.6237 21.5865 17.4385 22.0075 17.0995C22.4286 16.7605 22.7213 16.2881 22.8376 15.7602L24.7969 6.93734H4.64553M9.25291 23.5025C9.25291 24.1584 8.72126 24.69 8.06544 24.69C7.40962 24.69 6.87797 24.1584 6.87797 23.5025C6.87797 22.8467 7.40962 22.3151 8.06544 22.3151C8.72126 22.3151 9.25291 22.8467 9.25291 23.5025ZM22.3151 23.5025C22.3151 24.1584 21.7834 24.69 21.1276 24.69C20.4718 24.69 19.9401 24.1584 19.9401 23.5025C19.9401 22.8467 20.4718 22.3151 21.1276 22.3151C21.7834 22.3151 22.3151 22.8467 22.3151 23.5025Z" stroke="#C4754E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3>Order & Pay</h3>
                                <p>Use our app to order ahead or scan your code at the register.</p>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.iconCircle}><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.4753 12.6916C24.7957 13.1839 25.9707 14.0012 26.8916 15.0679C27.8125 16.1347 28.4496 17.4164 28.7438 18.7945C29.0381 20.1727 28.9801 21.6028 28.5752 22.9526C28.1704 24.3025 27.4316 25.5284 26.4274 26.5171C25.4232 27.5057 24.1859 28.2252 22.8299 28.609C21.4739 28.9928 20.0431 29.0284 18.6697 28.7127C17.2963 28.397 16.0247 27.74 14.9724 26.8026C13.9202 25.8652 13.1213 24.6775 12.6497 23.3496M7.98424 6.58739H9.38109V12.1748M21.5476 17.5946L22.5254 18.5863L18.5863 22.5254M17.7622 9.38109C17.7622 14.0098 14.0098 17.7622 9.38109 17.7622C4.75234 17.7622 1 14.0098 1 9.38109C1 4.75234 4.75234 1 9.38109 1C14.0098 1 17.7622 4.75234 17.7622 9.38109Z" stroke="#C4754E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                </div>
                                <h3>Earn Beans</h3>
                                <p>Collect 10 Beans for every $1 spent on drinks, food, or merch.</p>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.iconCircle}><svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 7.66709V25M13 7.66709C12.5177 5.67967 11.6873 3.98059 10.617 2.79142C9.5467 1.60225 8.28625 0.978174 7 1.00058C6.11595 1.00058 5.2681 1.35176 4.64298 1.97687C4.01786 2.60198 3.66667 3.4498 3.66667 4.33384C3.66667 5.21787 4.01786 6.06569 4.64298 6.6908C5.2681 7.31591 6.11595 7.66709 7 7.66709M13 7.66709C13.4823 5.67967 14.3127 3.98059 15.383 2.79142C16.4533 1.60225 17.7138 0.978174 19 1.00058C19.8841 1.00058 20.7319 1.35176 21.357 1.97687C21.9821 2.60198 22.3333 3.4498 22.3333 4.33384C22.3333 5.21787 21.9821 6.06569 21.357 6.6908C20.7319 7.31591 19.8841 7.66709 19 7.66709M22.3333 13.0003V22.3334C22.3333 23.0406 22.0524 23.7189 21.5523 24.219C21.0522 24.7191 20.3739 25 19.6667 25H6.33333C5.62609 25 4.94781 24.7191 4.44772 24.219C3.94762 23.7189 3.66667 23.0406 3.66667 22.3334V13.0003M2.33333 7.66709H23.6667C24.403 7.66709 25 8.26403 25 9.00039V11.667C25 12.4034 24.403 13.0003 23.6667 13.0003H2.33333C1.59695 13.0003 1 12.4034 1 11.667V9.00039C1 8.26403 1.59695 7.66709 2.33333 7.66709Z" stroke="#C4754E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                </div>
                                <h3>Redeem Favorites</h3>
                                <p>Cash in your Beans for free espressos, pastries, or bags of coffee.</p>
                            </div>
                        </div>
                    </section>
                    <div className={styles.box}>

                        <div className={styles.heading}>
                            <h1>Transaction History</h1>
                        </div>
                        {displayData.length === 0 ? (
                            <div className={styles.zeroState}>
                                <Image
                                    src={beansZero}
                                    alt="No products"
                                    width={100}
                                    height={150}
                                />


                                <div className={styles.zeroStateP}>
                                    <p style={{ color: 'black', }}>No White Mantis Beans yet</p>
                                    <p>Start earning beans when you shop.</p>
                                </div>


                                <button className={styles.zeroStateButton}
                                    onClick={() => router.push("/shop")}>
                                    Explore Coffee
                                </button>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                <div className={styles.gridss}>

                                    <div className={styles.tableHeading}>
                                        <div style={{ display: "flex", justifyContent: "center" }}>Details</div>
                                        <div style={{ display: "flex", justifyContent: "center" }}> Type</div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>Date</div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>Expiry Date</div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>Beans</div>
                                    </div>
                                    {displayData.map((item, index) => {
                                        const { datePart: txDate, timePart: txTime } = formatDateParts(item.transaction_date);
                                        const { datePart: expDate, timePart: expTime } = formatDateParts(item.expiry_date);
                                        return (
                                            <div key={index} className={styles.tableContent}>
                                                <div className={styles.itemDetail}>
                                                    {item.details.split(':').map((part, i) => (
                                                        <div key={i}>
                                                            {i === 0 ? part + ':' : part.trim()}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div
                                                    className={styles.itemType}
                                                    style={{
                                                        // Dynamic Colors based on your logic
                                                        color: item.coins.includes('+') ? '#428B54' : '#E54842',
                                                        backgroundColor: item.coins.includes('+') ? '#EBF7EE' : '#FDEEEE',

                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: '4px 16px',


                                                        borderRadius: '100px',
                                                        width: 'clamp(40px, 6vw, 80px)',
                                                        fontSize: 'var(--fs-14)',
                                                        fontWeight: '500',
                                                        textTransform: 'capitalize',

                                                    }}
                                                >
                                                    {item.transaction_type}
                                                </div>
                                                <div className={styles.itemDate}>
                                                    <div>{txDate}</div>
                                                    <div>{txTime}</div>
                                                </div>
                                                <div className={styles.itemDate}>
                                                    <div className={styles.itemDate}>
                                                        {item.expiry_date ? (
                                                            <>
                                                                <div>{expDate}</div>
                                                                <div>{expTime}</div>
                                                            </>
                                                        ) : (
                                                            <div>-</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={styles.itemDate} style={{
                                                    textAlign: 'center',
                                                    color: item.coins.includes('+') ? '#428B54' : '#E54842'
                                                }}>
                                                    {item.coins}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {hasMore && (
                                        <div className={styles.more}>
                                            <a onClick={loadMore} style={{ cursor: 'pointer' }}>View More</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.mobileOnly}>
                        <div className={styles.grid}>
                            <div className={styles.gridss}>

                                {displayData.map((item, index) => {
                                    const { datePart: txDate, timePart: txTime } = formatDateParts(item.transaction_date);
                                    return (
                                        <div key={index} className={styles.tableContent}>
                                            <div className={styles.LHS}>
                                                <div className={styles.itemDate}
                                                    style={{ color: item.coins.includes('+') ? '#428B54' : '#E54842' }}>
                                                    {item.transaction_type}
                                                </div>
                                                <div className={styles.itemDetail}>
                                                    {item.details.split(':').map((part, i) => (
                                                        <div key={i}>
                                                            {i === 0 ? part + ':' : part.trim()}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.RHS}>
                                                <div className={styles.itemDate} style={{
                                                    color: item.coins.includes('+') ? '#428B54' : '#E54842'
                                                }}>
                                                    {item.coins}
                                                </div>
                                                <div className={styles.itemDate}>
                                                    <div>{txDate}</div>
                                                    <div>{txTime}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {hasMore && (
                                    <div className={styles.more}>
                                        <a onClick={loadMore} style={{ cursor: 'pointer' }}>View more</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div ref={faqRef} className={styles.faq}>
                        <div className={styles.faqMain}>
                            <div className={styles.faqHeading}>
                                <h1>FREQUENTLY ASKED QUESTIONS</h1>
                            </div>
                            <div className={styles.faqQuestions}>
                                {QUESTIONS.map((item, index) => (
                                    <div
                                        key={index}
                                        className={styles.Qsection}
                                        /* ADD THIS LINE: Dynamic background color when open */
                                        style={{ backgroundColor: openIndex === index ? "#F1F1F1" : "transparent" }}
                                    >
                                        <div
                                            className={styles.quesStyle}
                                            onClick={() => toggleQuestion(index)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className={styles.questionLeft}>
                                                <span className={styles.number}>
                                                    {(index + 1).toString().padStart(2, "0")}
                                                </span>
                                                <h4>{item.question}</h4>
                                            </div>
                                            <span
                                                className={styles.cross}
                                                style={{
                                                    transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                                                    transition: "transform 0.3s ease",
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 18 18">
                                                    <path
                                                        d="M8 18V10H0V8H8V0H10V8H18V10H10V18H8Z"
                                                        fill="#6E736A"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <div
                                            className={`${styles.answers} ${openIndex === index ? styles.answersOpen : ""
                                                }`}
                                        >
                                            <p style={{ textAlign: "justify" }}>{item.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )

}

export default WhiteMantisBeans
