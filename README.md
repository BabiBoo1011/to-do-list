# Todo List

## 1. Giới thiệu ứng dụng

Todo List là ứng dụng React đơn giản cho phép thêm, hiển thị và xóa công việc. Danh sách được lưu trong `localStorage`, nên vẫn còn sau khi tải lại trang trên cùng trình duyệt.

## 2. Cách sử dụng các Hooks

### 2.1. `useState` – Quản lý dữ liệu

Ứng dụng sử dụng `useState` để quản lý danh sách công việc và nội dung đang nhập.

**Quản lý danh sách task:**

```jsx
const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
});
```

- `tasks` chứa danh sách công việc hiện tại.
- `setTasks` cập nhật danh sách.
- Khi khởi tạo, ứng dụng đọc dữ liệu đã lưu trong `localStorage`; nếu chưa có dữ liệu thì dùng mảng rỗng.

Khi thêm task:

```jsx
setTasks((prevTasks) => [...prevTasks, newTask]);
```

Hàm cập nhật nhận danh sách trước đó (`prevTasks`) và tạo một mảng mới gồm các task cũ cùng task mới. Cách này tránh sửa trực tiếp mảng state.

Khi xóa task:

```jsx
const deleteTask = (id) => {
  setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
};
```

`filter()` tạo một mảng mới chỉ giữ lại những task có `id` khác với ID cần xóa. Sau khi `setTasks()` cập nhật state, React render lại danh sách mà không hiển thị task đã xóa.

**Quản lý nội dung ô nhập:**

```jsx
const [taskName, setTaskName] = useState("");
```

`taskName` lưu nội dung người dùng đang nhập. `onChange` gọi `setTaskName(e.target.value)` để cập nhật state, còn `value={taskName}` liên kết giá trị của input với state. Sau khi thêm task, `setTaskName('')` làm trống ô nhập.

### 2.2. `useEffect` – Thực hiện tác vụ phụ

Ứng dụng dùng `useEffect` cho hai việc.

**Lưu danh sách task:**

```jsx
useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);
```

Mỗi khi `tasks` thay đổi, Effect chuyển danh sách thành chuỗi JSON và lưu vào `localStorage`. Điều này áp dụng cho cả lúc thêm và xóa task, nên danh sách mới được lưu và task đã xóa không xuất hiện lại sau khi tải lại trang.

Mảng phụ thuộc `[tasks]` cho biết Effect cần chạy lại khi `tasks` thay đổi.

**Focus ô nhập khi mở ứng dụng:**

```jsx
useEffect(() => {
  taskInputRef.current.focus();
}, []);
```

Effect gọi `focus()` để đặt con trỏ vào ô nhập, giúp người dùng có thể nhập ngay.

### 2.3. `useRef` – Tham chiếu đến ô input

```jsx
const taskInputRef = useRef(null);
```

`useRef` tạo một đối tượng có thuộc tính `.current`. Đối tượng này được giữ qua các lần render; thay đổi `.current` không tự làm component render lại.

Gắn ref vào input:

```jsx
<input
  ref={taskInputRef}
  type="text"
  value={taskName}
  onChange={(e) => setTaskName(e.target.value)}
/>
```

Sau khi React gắn phần tử input, `taskInputRef.current` tham chiếu đến phần tử đó. Ứng dụng gọi:

```jsx
taskInputRef.current.focus();
```

để focus ô nhập khi mở ứng dụng và sau khi xử lý thêm task.

## 3. Tóm tắt

| Hook        | Cách dùng trong ứng dụng                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| `useState`  | Quản lý danh sách task và nội dung ô nhập; thêm task bằng toán tử spread và xóa task bằng `filter()`. |
| `useEffect` | Lưu danh sách vào `localStorage` khi `tasks` thay đổi và focus input khi component được mount.        |
| `useRef`    | Tham chiếu đến input để gọi `focus()` mà không cần lưu phần tử DOM trong state.                       |
