import React from 'react';
import '../../styles/promotion.css';
import Swal from 'sweetalert2';
import CommonSection from '../../shared/CommonSection';
const promotions = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get 20% off on all summer tours!',
    image: 'https://hinhdep.khangviet.net/wp-content/uploads/2023/03/hinh-giam-gia-20-300x271.jpg',
  },
  {
    id: 2,
    title: 'Sale Booking Car',
    description: 'Sale 15% discount!',
    image: 'https://png.pngtree.com/png-clipart/20210309/original/pngtree-d-big-sale-15-percent-offer-icon-with-red-decorative-ribbon-png-image_5877154.png',
  },
  {
    id: 3,
    title: 'Sale Booking Hotel',
    description: 'Book now and get 10% off!',
    image: 'data:image/png;base64,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',
  },
  {
    id: 4,
    title: 'Sale off 20%',
    description: 'Sale sale sale hot!',
    image: 'https://hinhdep.khangviet.net/wp-content/uploads/2023/03/banner-giam-20-mau-do-300x300.jpg',
  },
  {
    id: 5,
    title: 'Domestic offer 30% off',
    description: 'Book your tours 3 months in advance and get a 30% discount!',
    image: 'https://png.pngtree.com/png-vector/20190214/ourlarge/pngtree-sale-discount-up-to-30--vector-template-design-illustration-png-image_507728.jpg',
  },
  
];
  
const Promotion = () => {
  const handleCouponClick = (promoTitle) => {
    Swal.fire({
      title: 'Phiếu giảm giá!',
      text: `Bạn đã nhận phiếu giảm giá cho chương trình: ${promoTitle}`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  return (
    <>
      <CommonSection title={"Deals for today"} />
    <div className="promotion-container">
      <div className="promotion-list">
        {promotions.map((promo) => (
          <div key={promo.id} className="promotion-item">
            <img src={promo.image} alt={promo.title} className="promotion-image" />
            <h2>{promo.title}</h2>
            <p>{promo.description}</p>
            <button className="coupon-button" onClick={() => handleCouponClick(promo.title)}>
              Nhận phiếu giảm giá
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Promotion;