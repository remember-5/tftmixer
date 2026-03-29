const notices = [
  {
    title: 'Set 10 Is Back',
    body: 'Set 10 has returned. Time to party again. Look out for small updates throughout.'
  },
  {
    title: 'We are moving',
    body: (
      <>
        We&apos;re automatically redirecting you to the new URL for the TFT mixer. Instead of{' '}
        <a href="https://officiallysp.net/tftmixer">officiallysp.net/tftmixer</a>, find us at{' '}
        <a href="https://tftmixer.officiallysp.net">tftmixer.officiallysp.net</a> in the future. As always, thank you all for
        your support and remember to report issues and feature suggestions to the{' '}
        <a href="https://github.com/OfficiallySp/tftmixer">
          <strong>GitHub repository</strong>
        </a>
        .
      </>
    )
  }
];

export default function NoticeStack() {
  return notices.map((notice) => (
    <div className="alert alert-warning" key={notice.title}>
      <strong>{notice.title}</strong>
      <br />
      {notice.body}
    </div>
  ));
}
