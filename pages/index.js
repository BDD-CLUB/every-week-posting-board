import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { useState, useEffect } from 'react';
import { fetchDiscussions } from '../utils/github';

export async function getStaticProps() {
    const discussions = await fetchDiscussions();
    return { props: { discussions } };
}

export default function HomePage({ discussions }) {
    const [safeHtml, setSafeHtml] = useState([]);

    useEffect(() => {
        setSafeHtml(discussions.map(discussion => ({
            ...discussion,
            body: DOMPurify.sanitize(marked(discussion.body))
        })));
    }, [discussions]);

    return (
        <div>
            <header style={{
                backgroundColor: '#f4f4f8', // 배경색
                color: '#333',             // 글자색
                padding: '10px 20px',     // 상하 10px, 좌우 20px 패딩
                textAlign: 'center',      // 텍스트 중앙 정렬
                fontSize: '24px',         // 폰트 크기
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'  // 그림자 효과
            }}>
                <h1>📝 BDD 글쓰기 챌린지 📝</h1>
            </header>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {safeHtml.map(discussion => (
                    <li key={discussion.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <h2>
                            <em>{discussion.title}</em> (By
                            <a href={`https://github.com/${discussion.author.login}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img src={discussion.author.avatarUrl} alt={discussion.author.login} style={{ width: 25, height: 25, borderRadius: '50%', verticalAlign: 'middle', marginLeft: '5px' }} />
                                <span style={{ marginLeft: '5px' }}>{discussion.author.login}</span>
                            </a>)
                        </h2>
                        <div dangerouslySetInnerHTML={{ __html: discussion.body }}></div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
