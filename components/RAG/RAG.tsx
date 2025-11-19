'use client'; // 声明这是一个客户端组件

import React, { useState } from 'react';

// 定义搜索结果的类型接口，以便于类型安全
interface SearchResult {
    ids: string[][];
    distances: number[][];
    metadatas: Record<string, any>[][];
    embeddings: null; // 根据Chroma返回，通常查询结果中此项为null
    documents: string[][];
}

const RagManager = () => {
    // --- State Hooks ---
    const [collectionName, setCollectionName] = useState('default');
    const [knowledgeText, setKnowledgeText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [addStatus, setAddStatus] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

    // --- API 调用函数 ---

    /**
     * 处理添加知识的逻辑
     */
    const handleAddKnowledge = async () => {
        if (!knowledgeText.trim()) {
            setAddStatus('错误：知识内容不能为空。');
            return;
        }
        setAddStatus('正在添加知识...');

        try {
            const response = await fetch('/api/chroma/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection: collectionName,
                    documents: [knowledgeText],
                    // 为每个文档生成唯一的 ID 和元数据
                    ids: [`id-${Date.now()}`],
                    metadatas: [{ source: 'web-ui', timestamp: new Date().toISOString() }],
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '添加知识失败');
            }

            setAddStatus(`成功！ ${result.added} 条文档已添加到 '${result.collection}' 集合。`);
            setKnowledgeText(''); // 成功后清空文本框
        } catch (error: any) {
            setAddStatus(`添加失败: ${error.message}`);
            console.error(error);
        }
    };

    /**
     * 处理搜索查询的逻辑
     */
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchStatus('错误：搜索内容不能为空。');
            return;
        }
        setSearchStatus('正在搜索...');
        setSearchResults(null); // 清空旧的搜索结果

        try {
            // 注意：我们正在调用一个 /api/chroma/search 的新路由
            const response = await fetch('/api/chroma/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection: collectionName,
                    query: searchQuery,
                    n_results: 3, // 指定希望返回最相似结果的数量
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '搜索失败');
            }

            setSearchResults(result.results);
            setSearchStatus('搜索完成。');
        } catch (error: any) {
            setSearchStatus(`搜索失败: ${error.message}`);
            console.error(error);
        }
    };

    // --- 组件样式 ---
    const styles: { [key: string]: React.CSSProperties } = {
        container: { fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' },
        section: { backgroundColor: '#f9f9f9', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
        title: { marginTop: '0', borderBottom: '2px solid #eee', paddingBottom: '10px' },
        input: { width: 'calc(100% - 22px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' },
        textarea: { width: 'calc(100% - 22px)', minHeight: '100px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' },
        button: { padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer', fontSize: '16px' },
        status: { marginTop: '10px', fontStyle: 'italic', color: '#555' },
        resultsContainer: { marginTop: '10px' },
        resultItem: { border: '1px solid #eee', padding: '15px', borderRadius: '4px', marginBottom: '10px', backgroundColor: 'white' },
        code: { backgroundColor: '#eee', padding: '2px 4px', borderRadius: '3px', fontFamily: 'monospace' }
    };

    return (
        <div style={styles.container}>
            <h1>RAG 知识管理</h1>

            <div style={styles.section}>
                <label>
                    Chroma 集合名称:
                    <input
                        type="text"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        style={styles.input}
                    />
                </label>
            </div>

            {/* --- 添加知识部分 --- */}
            <div style={styles.section}>
                <h2 style={styles.title}>1. 添加知识到 ChromaDB</h2>
                <textarea
                    style={styles.textarea}
                    value={knowledgeText}
                    onChange={(e) => setKnowledgeText(e.target.value)}
                    placeholder="在这里输入你想存入知识库的文本..."
                />
                <br />
                <button style={styles.button} onClick={handleAddKnowledge}>
                    存入知识库
                </button>
                {addStatus && <p style={styles.status}>{addStatus}</p>}
            </div>

            {/* --- 搜索知识部分 --- */}
            <div style={styles.section}>
                <h2 style={styles.title}>2. 从 ChromaDB 检索知识</h2>
                <input
                    type="text"
                    style={styles.input}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入你的问题或关键词进行搜索..."
                />
                <br />
                <button style={styles.button} onClick={handleSearch}>
                    查找
                </button>
                {searchStatus && <p style={styles.status}>{searchStatus}</p>}
            </div>

            {/* --- 结果展示部分 --- */}
            <div style={styles.section}>
                <h2 style={styles.title}>3. 查找结果</h2>
                <div style={styles.resultsContainer}>
                    {searchResults && searchResults.documents[0].length > 0 ? (
                        searchResults.documents[0].map((doc, index) => (
                            <div key={searchResults.ids[0][index]} style={styles.resultItem}>
                                <p><strong>匹配内容:</strong> {doc}</p>
                                <p><strong style={styles.code}>相似度距离 (越小越相关):</strong> {searchResults.distances[0][index].toFixed(4)}</p>
                                <p><strong style={styles.code}>元数据:</strong> {JSON.stringify(searchResults.metadatas[0][index])}</p>
                            </div>
                        ))
                    ) : (
                        <p>暂无搜索结果。</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RagManager;