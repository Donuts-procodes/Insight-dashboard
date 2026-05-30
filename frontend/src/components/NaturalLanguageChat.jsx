import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import axios from 'axios';

const NaturalLanguageChat = ({ schema, onChartSuggestion }) => {
    const [query, setQuery] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsThinking(true);
        try {
            const response = await axios.post('http://localhost:8000/query-chart', {
                schema_info: schema,
                query: query
            });
            onChartSuggestion(response.data);
            setQuery('');
        } catch (err) {
            console.error('LLM Query failed', err);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="nl-chat-container">
            <form onSubmit={handleSubmit} className="chat-input-wrapper">
                <Sparkles size={20} className="sparkle-icon" />
                <input 
                    type="text" 
                    placeholder="e.g., 'Show me revenue over time' or 'Plot age vs income'..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isThinking}
                />
                <button type="submit" disabled={isThinking || !query.trim()}>
                    {isThinking ? <div className="spinner-small"></div> : <Send size={18} />}
                </button>
            </form>
        </div>
    );
};

export default NaturalLanguageChat;
