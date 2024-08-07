import Device from "../models/deviceModel.js";
import Config from "../models/configModel.js";

// Lấy các thành phần con của một folder
export const getChildren = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm folder với ID đã cho
    const folder = await Device.findById(id);
    if (!folder || !folder.isFolder) {
      return res
        .status(404)
        .json({ message: "Folder not found or is not a folder" });
    }

    // Tìm các thành phần con của folder
    const children = await Device.find({ parent_id: id });

    // Tạo một danh sách các thông tin chi tiết cho từng thành phần con
    const childrenDetails = await Promise.all(
      children.map(async (child) => {
        if (child.isFolder) {
          // Nếu là folder, tính toán số lượng con, số lượng folder con và item con
          const totalChildren = await Device.countDocuments({
            parent_id: child._id,
          });
          const folderChildrenCount = await Device.countDocuments({
            parent_id: child._id,
            isFolder: true,
          });
          const itemChildrenCount = totalChildren - folderChildrenCount;

          return {
            ...child.toObject(),
            totalChildren,
            folderChildrenCount,
            itemChildrenCount,
          };
        } else {
          // Nếu là item, lấy cấu hình liên quan
          const configs = await Config.find({ device: child._id });

          // Tính toán số lượng config, config online và offline
          const configCount = configs.length;
          const onlineConfigCount = configs.filter(
            (config) => config.currentPower !== 0
          ).length;
          const offlineConfigCount = configCount - onlineConfigCount;

          return {
            ...child.toObject(),
            configCount,
            onlineConfigCount,
            offlineConfigCount,
          };
        }
      })
    );

    // Trả về thông tin chi tiết của các thành phần con
    res.json(childrenDetails);
  } catch (error) {
    console.error("Error fetching child devices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
