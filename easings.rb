class Easings
  class << self

    def linear(t)
      t
    end

    def easeInOutCubic(t)
      t =  2 * t
      if (t < 1)
        -1/2 * (Math.sqrt(1 - t*t) - 1)
      else
        1/2 * (Math.sqrt(1 - (t-2)*(t-2)) + 1)
      end
    end

  end
end
