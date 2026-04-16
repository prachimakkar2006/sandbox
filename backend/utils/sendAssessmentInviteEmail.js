const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function buildEmailHTML({ studentName, recruiterName, recruiterEmail, companyName, designation, assessmentTitle, targetRole, shareableLink }) {
  const displayCompany = companyName || 'our hiring team';
  const displayDesignation = designation || 'Recruiter';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#eef5ff;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1e293b;">
  <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
    <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:24px;padding:32px;box-shadow:0 14px 34px rgba(15,23,42,0.06);">
      <div style="margin-bottom:24px;">
        <div style="display:inline-block;padding:10px 16px;border-radius:999px;background:#f0f9ff;border:1px solid #bae6fd;color:#0369a1;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
          eraAI Assessment Invitation
        </div>
      </div>

      <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;color:#0f172a;">You have been invited to take an assessment</h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#475569;">Hi ${studentName},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#475569;">
        <strong style="color:#0f172a;">${displayCompany}</strong> has shortlisted your profile on eraAI and invited you to complete a recruiter assessment.
      </p>

      <div style="background:#f8fbff;border:1px solid #dbeafe;border-radius:18px;padding:18px 20px;margin-bottom:22px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Assessment Details</p>
        <p style="margin:0 0 6px;font-size:16px;color:#0f172a;font-weight:700;">${assessmentTitle}</p>
        <p style="margin:0;font-size:14px;color:#475569;">${targetRole || 'Hiring assessment'} at ${displayCompany}</p>
      </div>

      <div style="text-align:center;margin:28px 0 22px;">
        <a href="${shareableLink}" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#ffffff;text-decoration:none;padding:14px 34px;border-radius:14px;font-size:15px;font-weight:700;">
          Open Assessment
        </a>
        <p style="margin:12px 0 0;font-size:13px;color:#64748b;">If the button does not work, use this link:</p>
        <p style="margin:8px 0 0;font-size:13px;color:#0369a1;word-break:break-all;">${shareableLink}</p>
      </div>

      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:18px 20px;margin-bottom:22px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Recruiter Contact</p>
        <p style="margin:0 0 6px;font-size:15px;color:#0f172a;font-weight:600;">${recruiterName}</p>
        <p style="margin:0 0 6px;font-size:14px;color:#475569;">${displayDesignation}${companyName ? `, ${companyName}` : ''}</p>
        <p style="margin:0;font-size:14px;color:#0369a1;">${recruiterEmail}</p>
      </div>

      <p style="margin:0;font-size:14px;line-height:1.7;color:#64748b;">
        Best wishes,<br />
        eraAI Hiring Network
      </p>
    </div>
  </div>
</body>
</html>`;
}

async function sendAssessmentInviteEmail({ student, recruiter, assessment }) {
  const companyName = recruiter?.company?.name || '';
  const recruiterName = recruiter?.name || 'Recruiter';
  const recruiterEmail = recruiter?.email || process.env.EMAIL_USER;
  const designation = recruiter?.designation || 'Recruiter';

  await transporter.sendMail({
    from: `"eraAI" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: `${companyName || recruiterName} invited you to take ${assessment.title} on eraAI`,
    html: buildEmailHTML({
      studentName: student.name || 'Candidate',
      recruiterName,
      recruiterEmail,
      companyName,
      designation,
      assessmentTitle: assessment.title || 'Recruiter Assessment',
      targetRole: assessment.targetRole || '',
      shareableLink: assessment.shareableLink
    })
  });
}

module.exports = sendAssessmentInviteEmail;
