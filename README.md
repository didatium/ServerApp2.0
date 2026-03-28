# ServerApp 2.0 API Server (Đây là chỉ bản development)

Backend server được xây dựng bằng **Node.js + Express** để cung cấp API cho hệ thống quản lý nề nếp/lớp học theo tuần (lớp, người dùng, vi phạm, điểm, lịch trực, thống kê theo ngày...).

## 1) Công nghệ sử dụng

- Node.js
- Express
- MySQL (`mysql2`)
- Middleware: `cors`, `body-parser`

## 2) Cấu trúc dự án

```text
ServerApp2.0/
├── index.js                  # Điểm khởi chạy server + cấu hình middleware + API key
├── db/
│   └── db-config.js          # Cấu hình kết nối MySQL
├── routes/
│   ├── users.js              # API người dùng
│   ├── class.js              # API lớp
│   ├── rules.js              # API quy định / lỗi vi phạm
│   ├── week.js               # API tuần
│   ├── feedback.js           # API góp ý
│   ├── lichtruc.js           # API lịch trực
│   ├── score.js              # API điểm thi đua
│   ├── vipham.js             # API vi phạm
│   └── statisticOnDay.js     # API thống kê theo ngày
└── package.json
```

## 3) Cài đặt và chạy dự án

### Yêu cầu
- Node.js >= 16
- MySQL đang hoạt động

### Cài dependencies
```bash
npm install
```

### Chạy server
```bash
npm start
```

Server mặc định chạy tại:

```text
http://localhost:3000
```
