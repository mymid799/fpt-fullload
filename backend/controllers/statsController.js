import Windows from '../models/Windows.js';
import Office from '../models/Office.js';
import Tools from '../models/Tools.js';
import Antivirus from '../models/Antivirus.js';

/**
 * Lấy thống kê tổng quan
 * GET /api/stats
 */
export const getStats = async (req, res) => {
    try {
        console.log('📊 Getting statistics...');

        // Đếm tổng số phần mềm từ tất cả các danh mục
        const [windowsCount, officeCount, toolsCount, antivirusCount] = await Promise.all([
            Windows.countDocuments(),
            Office.countDocuments(),
            Tools.countDocuments(),
            Antivirus.countDocuments()
        ]);

        const totalSoftware = windowsCount + officeCount + toolsCount + antivirusCount;

        // Đếm link lỗi (có thể mở rộng logic này sau)
        const brokenLinks = 0; // Tạm thời set = 0, có thể thêm logic kiểm tra link sau

        // Tính phần trăm an toàn (100% - tỷ lệ link lỗi)
        const safetyPercentage = totalSoftware > 0 ? Math.round(((totalSoftware - brokenLinks) / totalSoftware) * 100) : 100;

        const stats = {
            totalSoftware,
            brokenLinks,
            safetyPercentage,
            categoryBreakdown: {
                windows: windowsCount,
                office: officeCount,
                tools: toolsCount,
                antivirus: antivirusCount
            }
        };

        console.log('📊 Statistics calculated:', stats);

        res.json({
            success: true,
            message: 'Lấy thống kê thành công',
            data: stats
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy thống kê'
        });
    }
};
