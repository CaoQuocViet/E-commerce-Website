import React from "react";

const ContactInfo = () => {
  const email = "khoingoc456@gmail.com";
  const phone = "+84832211203";
  return (
    <div className="contactInfo container">
      <div className="row">
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <a href={`tel:${phone}`}>
                {" "}
                <i className="fas fa-phone-alt text-danger"></i>
              </a>
            </div>
            <h5>Liên hệ 24/7</h5>
            <p>(+84)83 221 1203</p>
          </div>
        </div>
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <a href="https://goo.gl/maps/1pneNHVcdzzXW4LH8">
                <i className="fas fa-map-marker-alt text-danger"></i>
              </a>
            </div>
            <h5>184 Lê Đại Hành</h5>
            <p>Quận 10, TP.HCM</p>
          </div>
        </div>
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <a href={`mailto:${email}`}>
                <i className="fas fa-envelope text-danger"></i>
              </a>
            </div>
            <h5>Email</h5>
            <p>{email}</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-12 contact-Box">
        <div className="box-info">
          <div className="info-image">
            <i className="fas fa-user"></i>
          </div>
          <h5>Nhóm bán sách gồm: </h5>
          <p>Phạm Ngọc Khôi</p>
          <p>Cao Quốc Việt</p>
          <p>Trần Khải Trí</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
