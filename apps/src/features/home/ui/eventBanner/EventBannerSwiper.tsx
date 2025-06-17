import { Swiper, SwiperSlide } from 'swiper/react'
import { useState } from 'react'

interface EventBanner {
  href: string
  img: string
  srcSet: string
  alt: string
}

export function EventBannerSwiper() {
  const [activeBanner, setActiveBanner] = useState(0)

  const eventBanners = [
    {
      href: 'https://contents.ohou.se/projects/174926?affect_type=Home&affect_id=0',
      img: 'https://prs.ohousecdn.com/apne2/content/uploads/cards/project/v1-375025349881920.jpg?w=850&h=510&c=c',
      srcSet:
        'https://prs.ohousecdn.com/apne2/content/uploads/cards/project/v1-375025349881920.jpg?w=1275&h=765&c=c 1.5x,https://prs.ohousecdn.com/apne2/content/uploads/cards/project/v1-375025349881920.jpg?w=1700&h=1020&c=c 2x,https://prs.ohousecdn.com/apne2/content/uploads/cards/project/v1-375025349881920.jpg?w=2550&h=1530&c=c 3x',
      alt: '이벤트 배너',
    },
    {
      href: '/experts/moving?affect_type=Home&affect_id=0',
      img: 'https://prs.ohousecdn.com/apne2/commerce/uploads/banners/home_banner/v1-342120685363328.png?w=360',
      srcSet:
        'https://prs.ohousecdn.com/apne2/commerce/uploads/banners/home_banner/v1-342120685363328.png?w=540 1.5x,https://prs.ohousecdn.com/apne2/commerce/uploads/banners/home_banner/v1-342120685363328.png?w=720 2x,https://prs.ohousecdn.com/apne2/commerce/uploads/banners/home_banner/v1-342120685363328.png?w=1080 3x',
      title: '이벤트 배너2',
    },
  ]

  return (
    <section className="container mt-6 relative">
      <Swiper
        spaceBetween={12}
        slidesPerView={1}
        className="rounded-xl overflow-hidden"
        onSlideChange={(swiper) => setActiveBanner(swiper.activeIndex)}
      >
        {eventBanners.map((banner) => (
          <SwiperSlide key={banner.img}>
            <a href={banner.href} target="_blank" rel="noopener noreferrer">
              <img
                src={banner.img}
                srcSet={banner.srcSet}
                alt={banner.alt}
                className="w-full h-[180px] object-cover"
                loading="lazy"
              />
            </a>
          </SwiperSlide>
        ))}
        {/* 우측 하단 배지 넘버링 */}
        <div className="absolute right-3 bottom-3 z-20 bg-black/70 text-white px-2 py-1 rounded-full text-xs select-none pointer-events-none">
          {activeBanner + 1} / {eventBanners.length}
        </div>
      </Swiper>
    </section>
  )
}
