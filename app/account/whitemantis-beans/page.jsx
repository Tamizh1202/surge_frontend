'use client';
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios";
import styles from './page.module.css';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import beansZero from "./beansZero.png";

const QUESTIONS = [
    {
        question: "What are White Mantis Beans and how do they work?",
        answer: "White Mantis Beans are reward points you earn on orders, subscriptions, and workshop bookings. On every purchase, you earn WM Beans worth 10% of the order value (e.g. AED 1,000 = 100 Beans) and can be used for discounts on eligible purchases."
    },
    {
        question: "How do I earn Surge Beans?",
        answer: "You earn beans automatically with every purchase made through our app or website. Some promotional events may offer double beans."
    },
    {
        question: "Where can I use my Surge Beans?",
        answer: "Surge Beans can be redeemed at checkout for discounts on coffee, merchandise, and select workshop events."
    },
    {
        question: "Can I pay the full amount using Beans?",
        answer: "Beans can cover a significant portion of your total, but a minimum cash/card payment may be required depending on current store policy."
    },
    {
        question: "How do coin expiry and tracking work?",
        answer: "Beans are valid for 12 months. You can track your earning and redemption history in the Transaction History table above."
    }
];

function formatDateParts(isoString) {
    if (!isoString) return { datePart: 'N/A', timePart: '' };
    const d = new Date(isoString);
    const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
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
                    const response = await axiosClient.get(`/api/user-wt-coins`, {
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
                        transaction_type: 'Collected',
                        transaction_date: item.earnedAt,
                        expiry_date: item.expiryDate,
                        coins: `+${item.amount}`,
                        _sortDate: new Date(item.earnedAt),
                    }));

                    const redemptionTransactions = (doc.pointsRedemptionHistory || []).map(item => ({
                        details: item.type === 'offline' ? `Reference Id: ${item.offlineReferenceId}` : `Order Id: ${item.associatedOrder?.value?.id ?? 'N/A'}`,
                        transaction_type: 'Redeemed',
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

    const toggleQuestion = (index) => setOpenIndex(openIndex === index ? null : index);
    const scrollToFAQ = () => faqRef.current?.scrollIntoView({ behavior: "smooth" });
    const displayData = allTransactions.slice(0, visibleCount);
    const hasMore = visibleCount < allTransactions.length;
    const loadMore = () => setVisibleCount(prev => prev + 10);

    return (
        <div className={styles.head}>
            <div className={styles.border}>
                <div className={styles.main1}>
                    {/* Hero Section */}
                    <div className={styles.olive}>
                        <div className={styles.content1}>
                            <div className={styles.left}>
                                <h1 className={styles.heading}>{totalBalance} <span style={{ fontSize: '16px', fontWeight: '400', opacity: '0.8' }}>Surge Beans</span></h1>
                            </div>
                            <div className={styles.right} onClick={scrollToFAQ} style={{ cursor: "pointer" }}>
                                <p>How to use?</p>
                            </div>
                        </div>
                        <div className={styles.months}>
                            <h1 className={styles.validity}>Surge Beans are valid for 12 months from the date they're earned.</h1>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className={styles.howItWorks}>
                        <h1 className={styles.mainTitle}>How it Works</h1>
                        <div className={styles.stepsGrid}>
                            <div className={styles.stepItem}>
                                <div className={styles.iconCircle}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#C37B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3>Order & Pay</h3>
                                <p>Use our app to order ahead or scan your code at the register.</p>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.iconCircle}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="9" cy="9" r="7" stroke="#C37B5C" strokeWidth="2"/>
                                        <path d="M15 15L21 21" stroke="#C37B5C" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <h3>Earn Beans</h3>
                                <p>Collect 10 Beans for every $1 spent on drinks, food, or merch.</p>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.iconCircle}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="8" width="18" height="13" rx="2" stroke="#C37B5C" strokeWidth="2"/>
                                        <path d="M3 8L12 3L21 8" stroke="#C37B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3>Redeem Favorites</h3>
                                <p>Cash in your Beans for free espressos, pastries, or bags of coffee.</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className={styles.box}>
                        <div className={styles.heading}>
                            <h1>Transaction History</h1>
                        </div>
                        {displayData.length === 0 ? (
                            <div className={styles.zeroState}>
                                <Image src={beansZero} alt="No history" width={100} height={150} />
                                <div className={styles.zeroStateP}>
                                    <p style={{ color: 'black', fontWeight: '500' }}>No Surge Beans yet</p>
                                    <p>Start earning beans when you shop, subscribe, or join academy workshops.</p>
                                </div>
                                <button className={styles.zeroStateButton} onClick={() => router.push("/shop")}>
                                    Explore Coffee
                                </button>
                            </div>
                        ) : (
                            <div className={styles.gridss}>
                                <div className={styles.tableHeading}>
                                    <div>Details</div>
                                    <div>Type</div>
                                    <div>Date</div>
                                    <div>Expiry Date</div>
                                    <div style={{ textAlign: 'right' }}>Beans</div>
                                </div>
                                {displayData.map((item, index) => {
                                    const { datePart: txDate, timePart: txTime } = formatDateParts(item.transaction_date);
                                    const { datePart: expDate, timePart: expTime } = formatDateParts(item.expiry_date);
                                    const isCredit = item.coins.includes('+');
                                    return (
                                        <div key={index} className={styles.tableContent}>
                                            <div className={styles.itemDetail}>{item.details}</div>
                                            <div>
                                                <span className={isCredit ? styles.tagCollected : styles.tagRedeemed}>
                                                    {item.transaction_type}
                                                </span>
                                            </div>
                                            <div className={styles.itemDate}>
                                                <div>{txDate}</div>
                                                <div className={styles.subText}>{txTime}</div>
                                            </div>
                                            <div className={styles.itemDate}>
                                                {item.expiry_date ? (
                                                    <>
                                                        <div>{expDate}</div>
                                                        <div className={styles.subText}>{expTime}</div>
                                                    </>
                                                ) : "-"}
                                            </div>
                                            <div style={{ textAlign: 'right', color: isCredit ? '#428B54' : '#E54842', fontWeight: '500' }}>
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
                        )}
                    </div>

                    {/* FAQ Section */}
                    <div ref={faqRef} className={styles.faqMain}>
                        <div className={styles.faqHeading}>
                            <h1>FREQUENTLY ASKED QUESTIONS</h1>
                        </div>
                        <div className={styles.faqQuestions}>
                            {QUESTIONS.map((item, index) => (
                                <div key={index} className={styles.Qsection}>
                                    <div className={styles.quesStyle} onClick={() => toggleQuestion(index)} style={{ cursor: "pointer" }}>
                                        <div className={styles.questionLeft}>
                                            <span className={styles.number}>{(index + 1).toString().padStart(2, "0")}</span>
                                            <h4>{item.question}</h4>
                                        </div>
                                        <span className={styles.cross} style={{ transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                                            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M8 18V10H0V8H8V0H10V8H18V10H10V18H8Z" fill="#6E736A"/></svg>
                                        </span>
                                    </div>
                                    <div className={`${styles.answers} ${openIndex === index ? styles.answersOpen : ""}`}>
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhiteMantisBeans;