import { useEffect, useMemo, useRef, useState } from 'react'
import { days, interludes, likes, me, story, values } from '../data/personal'
import { useTypeSequence } from '../hooks/useTypeSequence'
import { trackEvent } from '../lib/analytics'

/** 필름 인화지 느낌의 사진 프레임 */
function Photo({ src, alt, caption, tilt = 0, className = '', parallax = false }) {
  const frame = (
    <div className="p-photo-frame">
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  )
  return (
    <figure className={`p-photo ${className}`} style={{ '--tilt': `${tilt}deg` }}>
      {parallax ? (
        <div className="p-parallax" data-parallax="">
          {frame}
        </div>
      ) : (
        frame
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** 섹션과 섹션 사이에 한 장 놓이는 사진 */
export function Interlude({ after }) {
  const item = interludes.find((i) => i.after === after)
  if (!item) return null
  const flip = interludes.indexOf(item) % 2 === 1
  return (
    <div className="p-interlude">
      <Photo
        src={item.src}
        alt=""
        caption={item.caption}
        tilt={flip ? 1.3 : -1.3}
        className="p-rise"
      />
    </div>
  )
}

export function Intro() {
  // 사진·이름은 바로 보이고, 인사말 → 소개 문장 → 명함 목록(나이·사는 곳·MBTI...) 순서로 이어서 타이핑합니다.
  const { allTexts, factLines, factStarts } = useMemo(() => {
    const factLines = me.facts.map((f) => (Array.isArray(f.v) ? f.v : [f.v]))
    const factStarts = factLines.reduce((starts, l) => {
      const prev = starts.length ? starts[starts.length - 1].end : 1 + me.intro.length
      starts.push({ start: prev, end: prev + l.length })
      return starts
    }, [])
    return {
      allTexts: [me.greeting, ...me.intro, ...factLines.flat()],
      factLines,
      factStarts: factStarts.map((s) => s.start),
    }
  }, [])
  const { texts: typed, doneIndex } = useTypeSequence(allTexts)
  const activeIndex = doneIndex + 1
  const caretAt = (i) => activeIndex === i && activeIndex < allTexts.length
  const renderTyped = (idx) => (
    <span className="p-caret-wrap">
      {typed[idx]}
      {caretAt(idx) && <span className="p-caret" aria-hidden="true" />}
    </span>
  )

  return (
    <section className="p-sec p-intro" id="intro">
      <div className="p-col">
        <Photo src={me.photo} alt={me.name} tilt={-1.5} className="p-portrait p-rise" />

        <h1 className="p-name p-rise">{me.name}</h1>
        <span className="p-rule p-rise" aria-hidden="true" />

        <div className="p-lead">
          <p>{renderTyped(0)}</p>
          {me.intro.map((_, i) => (
            <p key={i}>{renderTyped(i + 1)}</p>
          ))}
        </div>

        <table className="p-facts">
          <tbody>
            {me.facts.map((f, fi) => (
              <tr key={f.k}>
                <th scope="row">{f.k}</th>
                <td>
                  {factLines[fi].map((_, i) => (
                    <span key={i}>{renderTyped(factStarts[fi] + i)}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-cue" aria-hidden="true">
        <span className="p-latin">scroll</span>
        <span className="p-cue-line" />
      </div>
    </section>
  )
}

export function Story() {
  return (
    <section className="p-sec" id="story">
      <div className="p-col">
        <h2 className="p-h2 p-rise">{story.title}</h2>
        <p className="p-sub p-rise">{story.lead}</p>
      </div>

      <ol className="p-chapters">
        {story.chapters.map((c, i) => (
          <li key={c.no} className={`p-chapter${i % 2 ? ' is-flip' : ''}`}>
            <Photo
              src={c.photo}
              alt={c.title}
              tilt={i % 2 ? 1.6 : -1.6}
              className="p-rise"
              parallax
            />
            <div className="p-chapter-text p-rise">
              <span className="p-latin p-chapter-no">{c.no}</span>
              <span className="p-year">{c.year}</span>
              <h3 className="p-h3">{c.title}</h3>
              {c.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Days() {
  return (
    <section className="p-sec" id="days">
      <div className="p-col">
        <h2 className="p-h2 p-rise">{days.title}</h2>
        <p className="p-sub p-rise">{days.lead}</p>
        <div className="p-body p-rise">
          {days.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="p-gallery">
        {days.photos.map((ph, i) => (
          <Photo
            key={i}
            src={ph.src}
            alt={ph.caption}
            caption={ph.caption}
            tilt={i % 2 ? 1.4 : -1.2}
            className="p-rise"
            parallax
          />
        ))}
      </div>
    </section>
  )
}

export function Likes() {
  return (
    <section className="p-sec" id="likes">
      <div className="p-col">
        <h2 className="p-h2 p-rise">{likes.title}</h2>
        <p className="p-sub p-rise">{likes.lead}</p>
      </div>

      <div className="p-col">
        <ul className="p-likes">
          {likes.cards.map((card) => (
            <li key={card.label} className="p-like p-rise">
              <span className="p-like-label">{card.label}</span>
              <ul>
                {card.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <dl className="p-qa">
          {likes.qa.map((row, i) => (
            <div key={i} className="p-rise">
              <dt>{row.q}</dt>
              <dd>{row.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Values() {
  // 마무리 편지는 화면에 들어올 때만 타이핑을 시작합니다(로드 시 바로 시작하면 스크롤해서
  // 도착했을 땐 이미 다 끝나 있습니다).
  const [closingInView, setClosingInView] = useState(false)
  const closingRef = useRef(null)

  useEffect(() => {
    const el = closingRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        setClosingInView(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const { texts: typedClosing, doneIndex: closingDone } = useTypeSequence(values.closing, {
    start: closingInView,
  })
  const closingActive = closingDone + 1
  const closingCaretAt = (i) => closingActive === i && closingActive < values.closing.length

  return (
    <section className="p-sec p-values" id="values">
      <div className="p-col">
        <h2 className="p-h2 p-rise">{values.title}</h2>
        {values.lead && <p className="p-sub p-rise">{values.lead}</p>}

        <ul className="p-beliefs">
          {values.beliefs.map((b) => (
            <li key={b.title} className="p-rise">
              <h3 className="p-h3">{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ul>

        {values.photo && (
          <Photo
            src={values.photo}
            alt=""
            caption={values.photoCaption}
            tilt={-1.2}
            className="p-closing-photo p-rise"
          />
        )}

        <div className="p-closing p-rise" ref={closingRef}>
          {values.closing.map((line, i) => (
            <p key={i}>
              <span className="p-caret-wrap">
                {typedClosing[i]}
                {closingCaretAt(i) && <span className="p-caret" aria-hidden="true" />}
              </span>
            </p>
          ))}
          <p className="p-sign">{values.signature}</p>
          <a
            className="p-mail"
            href={`mailto:${me.email}`}
            onClick={() => trackEvent('email_click', { from: 'closing' })}
          >
            {me.email}
          </a>

          <ul className="p-socials">
            {me.socials
              .filter((s) => s.url)
              .map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackEvent('social_click', {
                        network: s.label.toLowerCase(),
                      })
                    }
                  >
                    <span className="p-social-name">{s.label}</span>
                    <span className="p-social-handle">{s.handle}</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
