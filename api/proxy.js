module.exports = async (req, res) => {
    const { platform, id } = req.query;

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
        let songData = await songRes.json();

        // QQ音乐特殊处理
        if (platform === '1') {
            // 获取歌词
            const lyricRes = await fetch(API_CONFIG[platform].lyric);
            const lyricData = await lyricRes.json();
            
            // 获取封面（通过歌曲mid）
            const mid = songData.data?.[0]?.mid;
            const cover = mid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${mid}.jpg` : '';
            
            return res.status(200).json({
                code: 200,
                cover: cover || songData.data?.[0]?.cover,
                title: songData.data?.[0]?.song,
                artist: songData.data?.[0]?.singer,
                album: songData.data?.[0]?.album,
                lyric: lyricData.data?.lrc || '暂无歌词'
            });
        }

        // 其他平台统一处理
        res.status(200).json({
            code: 200,
            cover: songData.cover || songData.data?.pic,
            title: songData.title || songData.data?.name,
            artist: songData.singer || songData.data?.artist,
            album: songData.album || songData.data?.album,
            lyric: songData.lrc || songData.data?.lrc || '暂无歌词'
        });
    } catch (error) {
        console.error('API请求失败:', error);
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
};
