module.exports = async (req, res) => {
    const { platform, id } = req.query;

    // 从环境变量获取API地址
    const API_CONFIG = {
        '1': { // QQ音乐
            song: `${process.env.QQ_MUSIC_API}${id}`,
            lyric: `${process.env.QQ_LYRIC_API}${id}`
        },
        '2': { // 网易云
            song: `${process.env.NETEASE_API}${id}`
        },
        '3': { // 酷我
            song: `${process.env.KUWO_API}${id}`
        }
    };

    if (!API_CONFIG[platform]) {
        return res.status(400).json({ code: 400, msg: '不支持的平台' });
    }

    try {
        // 获取歌曲信息
        const songRes = await fetch(API_CONFIG[platform].song);
        const songData = await songRes.json();

        // 如果是QQ音乐，额外获取歌词
        let lyric = '';
        if (platform === '1') {
            const lyricRes = await fetch(API_CONFIG[platform].lyric);
            const lyricData = await lyricRes.json();
            lyric = lyricData.data?.lrc || '暂无歌词';
        }

        // 统一返回格式
        res.status(200).json({
            code: 200,
            cover: songData.data?.[0]?.cover || songData.cover || songData.data?.pic,
            title: songData.data?.[0]?.song || songData.title || songData.data?.name,
            artist: songData.data?.[0]?.singer || songData.singer || songData.data?.artist,
            album: songData.data?.[0]?.album || songData.album || songData.data?.album,
            lyric: lyric || songData.lrc || songData.data?.lrc || '暂无歌词'
        });
    } catch (error) {
        console.error('API请求失败:', error);
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
};
