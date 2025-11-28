export async function onRequestGet(context) {
  try {
    const { BOOKMARKS_KV } = context.env;
    const settings = await BOOKMARKS_KV.get('user_settings', { type: 'json' });
    
    return new Response(JSON.stringify(settings || { 
      categories: ['全部', '开发', 'AI', '娱乐', '工具'],
      bgImage: '',
      siteIcon: ''
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '加载设置失败',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const { BOOKMARKS_KV } = context.env;
    const data = await context.request.json();
    
    await BOOKMARKS_KV.put('user_settings', JSON.stringify(data));
    
    return new Response(JSON.stringify({ 
      success: true,
      message: '设置保存成功' 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '保存设置失败',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
