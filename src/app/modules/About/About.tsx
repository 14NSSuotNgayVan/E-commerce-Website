import { Link } from "react-router-dom"

function About(){
    return (
<section className="py-3 py-md-5 py-xl-8">
  <div className="container">
    <div className="row">
      <div className="col-12 col-md-10 col-lg-8">
        <h3 className="fs-5 mb-2 text-secondary text-uppercase">Về chúng tôi</h3>
        <h2 className="display-5 mb-4 spaces fw-300">Vượt qua biên giới, nắm lấy những điều chưa biết và liên tục học hỏi.</h2>
        <Link to="/home"><button type="button" className="btn btn-lg btn-primary mb-3 mb-md-4 mb-xl-5">Kết nối với chúng tôi</button></Link>
      </div>
    </div>
  </div>

  <div className="container">
    <div className="row gy-3 gy-md-4 gy-lg-0">
      <div className="col-12 col-lg-6">
        <div className="card bg-light p-3 m-0">
          <div className="row gy-3 gy-md-0 align-items-md-center">
            <div className="col-md-5">
              <img src="public/media/avatars/z4327722367638_717ff2b2c2f1b8d6d46b9b88df3c2fd3.jpg" className="img-fluid rounded-start" alt="Why Choose Us?"></img>
            </div>
            <div className="col-md-7">
              <div className="card-body p-0">
                <h2 className="card-title h4 mb-3">TS. Vũ Mỹ Hạnh</h2>
                <p className="card-text lead">Với nhiều năm kinh nghiệm giảng dạy và kiến thức sâu rộng trong ngành, giáo viên hướng dẫn chúng tôi còn có một tinh thần nhiệt huyết, tận tâm với nghề, một trái tim nhân hậu và giàu lòng nhân ái.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-6">
        <div className="card bg-light p-3 m-0">
          <div className="row gy-3 gy-md-0 align-items-md-center">
            <div className="col-md-5">
              <img src="public/media/avatars/z4321374739207_880ae0a8f859e475b66b0afa393fe1b8.jpg" className="img-fluid rounded-start" alt="Visionary Team"></img>
            </div>
            <div className="col-md-7">
              <div className="card-body p-0">
                <h2 className="card-title h4 mb-3">Đội ngũ nhìn xa trông rộng</h2>
                <p className="card-text lead">Với đội ngũ nhà phát triển và bộ óc sáng tạo, chúng tôi bắt tay vào hành trình biến những điều không thể thành có thể.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    )
}
export {About}