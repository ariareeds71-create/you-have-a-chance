import React, { useEffect, useState } from 'react';
import './CommunityBoard.css';
import { supabase } from '../lib/supabase.js';

const spaces = {
  INTRODUCE: 'PEOPLE / INTRODUCTIONS',
  BUILD: 'BUILDERS / PROJECTS',
  HELP: 'BUILDERS / FEEDBACK',
  OFFER: 'MENTORS / GUIDANCE',
  SUPPORT: 'SUPPORTERS / PROJECTS',
};

function CommunityBoard({ role = 'MEMBER', requestedIntent = 'INTRODUCE' }) {
  const [posts, setPosts] = useState([]);
  const [intent, setIntent] = useState(requestedIntent);
  const [draft, setDraft] = useState('');
  const [commentFor, setCommentFor] = useState(null);
  const [comment, setComment] = useState('');
  const [activeSpace, setActiveSpace] = useState('ALL SPACES');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (spaces[requestedIntent]) setIntent(requestedIntent);
  }, [requestedIntent]);

  useEffect(() => {
    let active = true;
    const loadPosts = async () => {
      if (!supabase) {
        if (active) { setNotice('Connect Supabase before using the community feed.'); setLoading(false); }
        return;
      }
      const { data, error } = await supabase.from('posts').select('id, author_id, body, intent, space, created_at').order('created_at', { ascending: false }).limit(30);
      if (!active) return;
      setLoading(false);
      if (error) { setNotice('We could not load the community feed. Please try again.'); return; }
      const postIds = (data || []).map((post) => post.id);
      const [reactionsResult, commentsResult] = await Promise.all([
        postIds.length ? supabase.from('post_reactions').select('post_id').in('post_id', postIds) : Promise.resolve({ data: [], error: null }),
        postIds.length ? supabase.from('post_comments').select('post_id, body').in('post_id', postIds).order('created_at', { ascending: true }) : Promise.resolve({ data: [], error: null }),
      ]);
      const reactionCounts = (reactionsResult.data || []).reduce((counts, reaction) => ({ ...counts, [reaction.post_id]: (counts[reaction.post_id] || 0) + 1 }), {});
      const commentsByPost = (commentsResult.data || []).reduce((comments, item) => ({ ...comments, [item.post_id]: [...(comments[item.post_id] || []), item.body] }), {});
      setPosts((data || []).map((post) => ({ id: post.id, authorId: post.author_id, author: 'C.A.N. member', role: 'MEMBER', intent: post.intent, space: post.space, text: post.body, likes: reactionCounts[post.id] || 0, comments: commentsByPost[post.id] || [] })));
    };
    loadPosts();
    return () => { active = false; };
  }, []);

  const publish = async () => {
    if (!draft.trim() || !supabase) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setNotice('Sign in to publish to the community.'); return; }
    const result = await supabase.from('posts').insert({ author_id: userData.user.id, intent, space: spaces[intent], body: draft.trim() }).select('id, author_id, body, intent, space').single();
    if (result.error) { setNotice('We could not publish your post. Please try again.'); return; }
    setPosts((current) => [{ id: result.data.id, authorId: result.data.author_id, author: 'You', role, intent: result.data.intent, space: result.data.space, text: result.data.body, likes: 0, comments: [] }, ...current]);
    setDraft('');
    setNotice('Your post is live.');
  };

  const react = async (id) => {
    if (!supabase) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setNotice('Sign in to react to posts.'); return; }
    const result = await supabase.from('post_reactions').insert({ post_id: id, user_id: userData.user.id });
    if (result.error) {
      if (result.error.code === '23505') { setNotice('You already supported this post.'); return; }
      setNotice('We could not save your reaction. Please try again.'); return;
    }
    setPosts((current) => current.map((post) => post.id === id ? { ...post, likes: post.likes + 1 } : post));
  };

  const deletePost = async (post) => {
    if (!supabase) { setNotice('Supabase is not configured.'); return; }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user || userData.user.id !== post.authorId) { setNotice('Only the author can delete this post.'); return; }
    const result = await supabase.from('posts').delete().eq('id', post.id).eq('author_id', userData.user.id);
    if (result.error) { setNotice('We could not delete your post. Please try again.'); return; }
    setPosts((current) => current.filter((item) => item.id !== post.id));
  };

  const addComment = async (id) => {
    if (!comment.trim() || !supabase) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setNotice('Sign in to comment on posts.'); return; }
    const result = await supabase.from('post_comments').insert({ post_id: id, author_id: userData.user.id, body: comment.trim() });
    if (result.error) { setNotice('We could not save your comment. Please try again.'); return; }
    setPosts((current) => current.map((post) => post.id === id ? { ...post, comments: [...post.comments, comment.trim()] } : post));
    setComment('');
    setCommentFor(null);
  };

  const visiblePosts = activeSpace === 'ALL SPACES' ? posts : posts.filter((post) => post.space === activeSpace);

  return (
    <section className="community-board">
      <div className="community-board__heading"><div><p className="kicker">THE C.A.N. COMMUNITY</p><h2>FIND THE<br /><em>RIGHT ROOM.</em></h2></div><p>Introduce yourself, share what you are building, ask for help, or offer what you know. Posts come from the C.A.N. community.</p></div>
      {notice && <p className="community-notice">{notice}</p>}
      <div className="community-board__layout"><div>
        <div className="community-composer"><div className="community-composer__top"><strong>WHAT DO YOU WANT TO SHARE?</strong><span>{loading ? 'LOADING COMMUNITY' : 'LIVE DATABASE FEED'}</span></div><div className="intent-tabs">{Object.keys(spaces).map((key) => <button key={key} className={intent === key ? 'active' : ''} onClick={() => setIntent(key)}>{key}</button>)}</div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Share what you are building, learning or looking for..." maxLength={600} /><div className="community-composer__bottom"><span>ROUTED TO <b>{spaces[intent]}</b></span><button className="button button--light" disabled={loading || !draft.trim()} onClick={publish}>PUBLISH TO SPACE</button></div></div>
        <div className="space-filter">{['ALL SPACES', ...Object.values(spaces)].map((space) => <button key={space} className={activeSpace === space ? 'active' : ''} onClick={() => setActiveSpace(space)}>{space}</button>)}</div>
        {loading && <div className="community-empty"><p className="kicker">COMMUNITY</p><h3>LOADING POSTS...</h3></div>}
        {!loading && visiblePosts.length === 0 && <div className="community-empty"><p className="kicker">COMMUNITY</p><h3>NOTHING HERE YET.</h3><p>Share what you are building, learning or looking for.</p></div>}
        {visiblePosts.map((post) => <article className="community-post" key={post.id}><div className="community-post__meta"><div className="community-post__avatar">{post.author.slice(0, 1)}</div><div><strong>{post.author}</strong><span>{post.role} / {post.space}</span></div>{post.author === 'You' && <button aria-label="Delete your post" onClick={() => deletePost(post)}>DELETE</button>}</div><p className="community-post__text">{post.text}</p><div className="community-post__actions"><button onClick={() => react(post.id)}>SUPPORT {post.likes}</button><button onClick={() => setCommentFor(commentFor === post.id ? null : post.id)}>COMMENT {post.comments.length}</button></div>{commentFor === post.id && <div className="community-comment"><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a thoughtful response..." /><button onClick={() => addComment(post.id)}>SEND</button></div>}{post.comments.length > 0 && <div className="community-post__comments">{post.comments.map((item, index) => <p key={`${post.id}-${index}`}>{item}</p>)}</div>}</article>)}
      </div><aside className="community-board__rail"><div className="community-safety"><p className="kicker">PRIVATE BY DEFAULT</p><strong>YOU CONTROL THE DOOR.</strong><p>Only publish what you want the community to see. Never share passwords, identity documents, or payment details here.</p></div></aside></div>
    </section>
  );
}

export default CommunityBoard;