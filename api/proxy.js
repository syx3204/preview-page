export default async (req, res) => {
    const { platform, id } = req.query;

    const API_CONFIG = {
        '1': process.env.QQ_LYRIC_API,  // QQ音乐歌词
        '2': process.env.NETEASE_API,   // 网易云
        '3': process.env.KUWO_API       // 酷我
    };

    try {
        const response = await fetch(`${API_CONFIG[platform]}${id}`);
        const data = await response.json();

        // 网易云特殊处理
        if (platform === '2') {
            res.status(200).json({
                code: 200,
                cover: data.cover,
                title: data.title,
                artist: data.singer,
                album: '', // 网易云API无专辑字段
                lyric: data.lrc || '暂无歌词'
            });
        } 
        // 酷我特殊处理
        else if (platform === '3') {
            res.status(200).json({
                code: 200,
                cover: data.data.pic,
                title: data.data.name,
                artist: data.data.artist,
                album: data.data.album,
                lyric: data.data.lrc || '暂无歌词'
            });
        }
        // QQ音乐歌词
        else {
            res.status(200).json({
                code: 200,
                lyric: data.data?.lrc || '暂无歌词'
            });
        }
    } catch (error) {
        console.error('API请求失败:', error);
        res.status(500).json({ 
            code: 500, 
            msg: '服务器错误',
            ...(platform !== '1' ? { // 非QQ音乐返回空数据
                cover: '',
                title: '',
                artist: '',
                album: '',
                lyric: '加载失败'
            } : { lyric: '加载失败' })
        });
    }
};
