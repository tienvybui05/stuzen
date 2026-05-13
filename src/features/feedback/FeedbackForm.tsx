import { ContactForm } from '../../components/ContactForm'
import { Card } from '../../components/ui/Card'

export function FeedbackForm() {
  return (
    <Card
      title="Contact"
      description="Gửi góp ý hoặc yêu cầu hỗ trợ cho StuZen. Mỗi IP chỉ gửi được một lần trong 60 giây."
    >
      <ContactForm />
    </Card>
  )
}
