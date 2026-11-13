import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, CircleAlert, CircleDashed, Clock3, FileText, MessageSquareText, ShieldAlert, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { useRole } from "@/lib/role-context";

type VerificationState = "Verified" | "Needs Attention" | "Missing" | "Pending" | "Not Applicable";
type DecisionType = "Approve" | "Request Information" | "Decline";

type ReviewDetailData = {
  reviewId: string;
  reviewType: string;
  reviewStatus: string;
  priority: string;
  submittedLabel: string;
  dueLabel?: string;
  attention: string;
  memberName: string;
  memberNumber: string;
  primaryRole: string;
  membershipType: string;
  membershipStatus: string;
  currentValidity: string;
  reviewRequest: string;
  verificationItems: Array<{ label: string; state: VerificationState; detail?: string }>;
  supportingInformation: Array<{ label: string; value: string; actionLabel?: string }>;
  reviewerNotes: Array<{ author: string; timestamp: string; note: string }>;
  history: Array<{ label: string; date: string; detail: string }>;
};

const reviewDetailData: ReviewDetailData = {
  reviewId: "RV-000124",
  reviewType: "Membership renewal review",
  reviewStatus: "In Review",
  priority: "High",
  submittedLabel: "Submitted 2 days ago",
  dueLabel: "Due in 3 days",
  attention: "Supporting document requires verification",
  memberName: "Ahmad Rahman",
  memberNumber: "APSSI-00000124",
  primaryRole: "Coach",
  membershipType: "Association Member",
  membershipStatus: "Active",
  currentValidity: "Until 31 December 2026",
  reviewRequest: "Membership Renewal",
  verificationItems: [
    { label: "Member identity matches record", state: "Verified", detail: "Submitted profile information is consistent with the current member record." },
    { label: "Membership requirements complete", state: "Verified", detail: "Qualification and registration checks are complete." },
    { label: "Supporting document requires review", state: "Needs Attention", detail: "The renewal certificate is present but the validity date needs a manual check." },
    { label: "Reviewer confirmation pending", state: "Pending", detail: "Awaiting officer confirmation before final closure." },
    { label: "Additional qualification check", state: "Not Applicable", detail: "Not required for this membership type." },
  ],
  supportingInformation: [
    { label: "Application note", value: "Renewal submitted after a reviewer query on qualification status." },
    { label: "Previous review context", value: "Last renewal approved on 15 December 2025." },
    { label: "Required document", value: "Membership certificate and supporting renewal attachment", actionLabel: "View document" },
  ],
  reviewerNotes: [
    { author: "Membership officer", timestamp: "12 Nov 2026, 14:30", note: "Identity information matches the submitted record." },
    { author: "Association reviewer", timestamp: "13 Nov 2026, 09:15", note: "Renewal certificate is available, but the expiration date should be confirmed before approval." },
  ],
  history: [
    { label: "Review submitted", date: "12 Nov 2026", detail: "Membership renewal review created." },
    { label: "Assigned to membership reviewer", date: "13 Nov 2026", detail: "Review package assigned to the current scope." },
    { label: "Verification started", date: "13 Nov 2026", detail: "Officer check-in started for document validation." },
  ],
};

const verificationStyles: Record<VerificationState, string> = {
  Verified: "border-success/20 bg-success/10 text-success",
  "Needs Attention": "border-warning/25 bg-warning/12 text-warning",
  Missing: "border-destructive/20 bg-destructive/10 text-destructive",
  Pending: "border-info/20 bg-info/10 text-info",
  "Not Applicable": "border-muted bg-muted text-muted-foreground",
};

function ReviewPill({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>
      {label}
    </span>
  );
}

function VerificationPill({ state }: { state: VerificationState }) {
  return <ReviewPill label={state} tone={verificationStyles[state]} />;
}

export function MembershipReviewDetail() {
  const navigate = useNavigate();
  const { role } = useRole();
  const [selectedDecision, setSelectedDecision] = useState<DecisionType | null>(null);
  const [notesDraft, setNotesDraft] = useState("Identity matches the submitted documents. Please confirm the validity date before closing this review.");

  const canDecide = useMemo(() => role === "association", [role]);

  const description = useMemo(() => {
    if (!canDecide) {
      return "This review is visible to your current scope, but final decisions are restricted by role and association authority.";
    }
    return "A decision can be made once required verification is complete and the review context is confirmed.";
  }, [canDecide]);

  if (role !== "association") {
    return (
      <div className="space-y-6">
        <PageHeader title="Membership review detail" description="Restricted review access" />
        <div className="surface rounded-xl border border-warning/20 bg-warning/5 p-6">
          <div className="mb-3 flex items-center gap-2 text-warning">
            <ShieldAlert className="size-4" />
            <span className="font-semibold">Limited review access</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You can view the review context, but you do not currently have authority to make a final membership decision.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={reviewDetailData.reviewType}
        description={`${reviewDetailData.reviewId} · ${reviewDetailData.submittedLabel}`}
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/members/review" })}>
            <ArrowLeft className="mr-2 size-4" />
            Back to review queue
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <div className="surface rounded-xl p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-small font-semibold uppercase tracking-wide text-muted-foreground">Review context</div>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">{reviewDetailData.reviewType}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{reviewDetailData.reviewId}</span>
                  <span>·</span>
                  <span>{reviewDetailData.submittedLabel}</span>
                  {reviewDetailData.dueLabel && (
                    <>
                      <span>·</span>
                      <span>{reviewDetailData.dueLabel}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <ReviewPill label={reviewDetailData.reviewStatus} tone="border-info/20 bg-info/10 text-info" />
                <ReviewPill label={`${reviewDetailData.priority} priority`} tone="border-warning/25 bg-warning/12 text-warning" />
              </div>
            </div>
          </div>

          <div className="surface rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <UserRound className="size-4" />
              Member context
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xl font-semibold text-foreground">{reviewDetailData.memberName}</div>
                <div className="text-sm text-muted-foreground">{reviewDetailData.memberNumber}</div>
                <div className="mt-2 text-sm text-muted-foreground">Primary role: {reviewDetailData.primaryRole}</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate({ to: "/members/$memberId", params: { memberId: "APSSI-00000124" } })}>
                View member detail
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>

          <div className="surface rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <FileText className="size-4" />
              Membership context
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Membership type</div>
                <div className="mt-1 font-medium text-foreground">{reviewDetailData.membershipType}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Current status</div>
                <div className="mt-1 font-medium text-foreground">{reviewDetailData.membershipStatus}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Current validity</div>
                <div className="mt-1 font-medium text-foreground">{reviewDetailData.currentValidity}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Review request</div>
                <div className="mt-1 font-medium text-foreground">{reviewDetailData.reviewRequest}</div>
              </div>
            </div>
          </div>

          <div className="surface rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <CheckCircle2 className="size-4" />
              Required verification
            </div>
            <div className="space-y-3">
              {reviewDetailData.verificationItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium text-foreground">{item.label}</div>
                    {item.detail && <div className="mt-1 text-sm text-muted-foreground">{item.detail}</div>}
                  </div>
                  <VerificationPill state={item.state} />
                </div>
              ))}
            </div>
          </div>

          <div className="surface rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <FileText className="size-4" />
              Supporting information
            </div>
            <div className="space-y-3">
              {reviewDetailData.supportingInformation.map((item) => (
                <div key={item.label} className="rounded-lg border bg-muted/20 p-3">
                  <div className="text-small text-muted-foreground">{item.label}</div>
                  <div className="mt-1 text-sm font-medium text-foreground">{item.value}</div>
                  {item.actionLabel && (
                    <Button variant="link" size="sm" className="mt-2 p-0 text-primary">
                      {item.actionLabel}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="surface rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <MessageSquareText className="size-4" />
              Reviewer notes
            </div>
            <textarea
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 focus:border-ring"
            />
            <div className="mt-4 space-y-3">
              {reviewDetailData.reviewerNotes.map((entry) => (
                <div key={`${entry.author}-${entry.timestamp}`} className="rounded-lg border bg-muted/20 p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-foreground">{entry.author}</span>
                    <span className="text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground">{entry.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <CircleAlert className="size-4" />
              Review status & attention
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Review status</div>
                <div className="mt-1 text-base font-semibold text-foreground">{reviewDetailData.reviewStatus}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Attention</div>
                <div className="mt-1 text-base font-semibold text-foreground">{reviewDetailData.attention}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Priority</div>
                <div className="mt-1 text-base font-semibold text-foreground">{reviewDetailData.priority}</div>
              </div>
            </div>
          </div>

          <div className="surface rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock3 className="size-4" />
              Decision area
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{description}</p>

            {!canDecide ? (
              <div className="rounded-lg border border-warning/20 bg-warning/5 p-3 text-sm text-warning-foreground">
                Decision access restricted for your current role and scope.
              </div>
            ) : (
              <div className="space-y-3">
                {(["Approve", "Request Information", "Decline"] as DecisionType[]).map((decision) => (
                  <Button
                    key={decision}
                    variant={selectedDecision === decision ? "default" : "outline"}
                    className="w-full justify-center"
                    onClick={() => {
                      setSelectedDecision(decision);
                      if (decision === "Request Information") {
                        return;
                      }
                    }}
                  >
                    {decision}
                  </Button>
                ))}
              </div>
            )}

            {selectedDecision && (
              <div className="mt-5 rounded-lg border border-border bg-muted/20 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CheckCircle2 className="size-4 text-success" />
                  Confirm {selectedDecision}
                </div>
                <p className="text-sm text-muted-foreground">
                  You are about to {selectedDecision.toLowerCase()} this review and create a governance event for the member record.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedDecision(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setSelectedDecision(null)}>
                    Confirm decision
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="surface rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <CircleDashed className="size-4" />
              Authorized review history
            </div>
            <div className="space-y-3">
              {reviewDetailData.history.map((event) => (
                <div key={`${event.label}-${event.date}`} className="rounded-lg border bg-muted/20 p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-foreground">{event.label}</span>
                    <span className="text-muted-foreground">{event.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="surface rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="size-4 text-warning" />
            Information and review notes remain distinct from final decision.
          </div>
          <Button variant="ghost" size="sm">
            View full governance history
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
