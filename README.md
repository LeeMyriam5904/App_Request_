# 🏢 HR Service Desk – Enterprise Web Application

Hệ thống quản lý và xử lý yêu cầu Nhân sự tập trung, minh bạch và tự động hóa theo chuẩn **PRD v1.0**.

---

## 🌟 Tính năng nổi bật theo PRD

### 1. 🧑 Employee Portal (Cổng thông tin Nhân viên)
- **Dashboard Tổng quan:** Chào đón cá nhân hóa, xem nhanh các yêu cầu gần đây và các cảnh báo cần bổ sung thông tin.
- **Tạo yêu cầu 3 bước:**
  - Bước 1: Chọn nhóm & loại dịch vụ (với cam kết thời gian SLA hiển thị rõ ràng).
  - Bước 2: Form động theo từng loại yêu cầu (Điền lý do, chọn kỳ lương, ngày công, mục đích xác nhận,...).
  - Bước 3: Đính kèm tệp tin tài liệu (PDF, Word, Ảnh), chọn mức độ ưu tiên (Thấp, Bình thường, Cao, Khẩn cấp).
- **Theo dõi tiến độ trực quan:** Visual timeline stepper, đồng hồ đếm ngược SLA thời gian thực, huy hiệu trạng thái màu sắc theo chuẩn thiết kế.
- **Trao đổi trực tiếp 2 chiều:** Nhắn tin, giải trình và đính kèm hồ sơ với chuyên viên HR trong từng ticket.
- **Đánh giá dịch vụ (CSAT):** Chấm điểm 1-5 sao ⭐ và phản hồi chất lượng phục vụ sau khi ticket hoàn thành.
- **Quyền Reopen:** Yêu cầu mở lại xử lý nếu kết quả chưa đạt yêu cầu.

### 2. 👩‍💼 HR Workspace (Không gian làm việc HR Specialist)
- **Operational Dashboard:** 4 thẻ KPI thời gian thực: *Ticket mới, Đang xử lý, Sắp hết SLA (< 8h), Quá hạn SLA*.
- **Hai chế độ xem linh hoạt:**
  - *Chế độ Bảng (Table View):* Lọc đa chiều theo Trạng thái, Chuyên viên phụ trách, Mức độ ưu tiên, Danh mục.
  - *Chế độ Kanban (Kanban Board):* Trực quan hóa quy trình xử lý theo các cột trạng thái.
- **Xử lý ticket phân tầng:**
  - Tiếp nhận (Claim ticket) chỉ với 1 click.
  - Phản hồi công khai cho nhân viên với thư viện mẫu câu trả lời nhanh (Response Templates).
  - **Ghi chú nội bộ (Internal Notes):** Đánh dấu màu vàng riêng biệt, chỉ team HR nhìn thấy để thảo luận kín.
  - Chuyển trạng thái tuân thủ quy trình 10 trạng thái của PRD.
  - Tạm dừng SLA khi yêu cầu nhân viên bổ sung thông tin (Need Info).
  - Escalate lên HR Manager đối với các trường hợp phức tạp.
- **Audit Trail:** Lịch sử mọi thao tác thay đổi trạng thái, cập nhật trên hệ thống.

### 3. 👩‍💼 HR Manager Analytics (Giám sát & Báo cáo)
- **SLA Compliance Rate:** Tỷ lệ đạt cam kết xử lý đúng hạn toàn bộ phòng ban (Mục tiêu ≥ 90%).
- **Average Resolution Time:** Đo lường thời gian giải quyết trung bình.
- **CSAT Score:** Điểm số hài lòng trung bình của nhân viên.
- **Phân bổ theo loại yêu cầu:** Biểu đồ tỷ lệ danh mục phát sinh nhiều yêu cầu nhất.
- **Workload Distribution:** Khối lượng công việc và tỷ lệ hoàn thành theo từng chuyên viên HR.
- **Xuất báo cáo:** Xuất dữ liệu báo cáo ra file Excel / CSV tải về máy.

### 4. ⚙️ Admin Panel (Quản trị Hệ thống)
- **User & RBAC:** Quản lý tài khoản, phòng ban và phân quyền 4 vai trò.
- **Category & SLA Configuration:** Tùy biến thời gian cam kết SLA (giờ) cho từng danh mục.
- **Response Templates:** Tạo mới, chỉnh sửa và quản lý các câu trả lời mẫu cho HR.
- **System Audit Logs:** Nhật ký truy vết toàn bộ hoạt động trong hệ thống.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Plus Jakarta Sans Font
- **Icons:** Lucide React
- **Hiệu ứng:** Canvas Confetti
- **Lưu trữ dữ liệu:** LocalStorage State Management với bộ hạt giống dữ liệu mẫu (Seed Data) phong phú, có tính năng khôi phục mặc định (Reset Demo Data).

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Khởi chạy môi trường phát triển (Development):
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### 3. Build đóng gói cho Production:
```bash
npm run build
```

---

## 👥 Danh sách tài khoản thử nghiệm (Persona Switcher)

Ngay trên góc phải thanh điều hướng (Navbar), bạn có thể click chọn menu chuyển đổi vai trò bất kỳ lúc nào:

| Vai trò | Họ và tên | Chức danh | Quyền hạn |
|---|---|---|---|
| **Employee** | Nguyễn Văn Minh | Chuyên viên Kinh doanh | Gửi yêu cầu, theo dõi, chat, đánh giá |
| **HR Staff** | Nguyễn Thị Hằng | Chuyên viên C&B | Tiếp nhận, đổi trạng thái, ghi chú nội bộ |
| **HR Manager** | Trần Thị Lan | Trưởng phòng Nhân sự | Xem báo cáo SLA, CSAT, phân bổ công việc |
| **Admin** | Lê Hoàng Tuấn | Quản trị viên Hệ thống | Quản lý User, sửa SLA, quản lý Template |
