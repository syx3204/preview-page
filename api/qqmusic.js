export default async (req, res) => {
    const { id, t = '0' } = req.query;

    try {
        const response = await fetch(`${process.env.QQ_MUSIC_API}${id}`);
        const data = await response.json();

        if (data.code !== 200 || !data.data) {
            throw new Error('QQ音乐API返回异常');
        }

        const song = data.data;
        res.status(200).json({
            code: 200,
            cover: song.cover,
            title: song.song,
            artist: song.singer,
            album: song.album,
            subtitle: song.subtitle,
            time: song.time,
            link: song.link,
            id: song.id,
            mid: song.mid,
            vid: song.vid,
            type: t // 传递type参数到前端
        });
    } catch (error) {
        console.error('QQ音乐处理失败:', error);
        res.status(500).json({
            code: 500,
            msg: 'QQ音乐数据解析失败',
            cover: '',
            title: '解析失败',
            artist: '',
            album: ''
        });
    }
};
